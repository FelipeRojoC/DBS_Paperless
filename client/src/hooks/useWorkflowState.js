import { useState, useCallback } from 'react';

export const WORKFLOW_STATUS = {
    LOCKED: 'locked',       // Previous section not completed/approved
    OPEN: 'open',           // Ready for Technician input
    REVIEW: 'review',       // Waiting for Supervisor approval
    APPROVED: 'approved'    // Section completed and closed
};

export const ROLES = {
    TECHNICIAN: 'technician',
    SUPERVISOR: 'supervisor'
};

/**
 * Manages the state of a multi-step workflow with hold points.
 * @param {Array} initialSections - Array of section definitions
 * @param {string} initialRole - Current user role (default: TECHNICIAN)
 */
export function useWorkflowState(initialSections = [], initialRole = ROLES.TECHNICIAN) {
    const [activeRole, setActiveRole] = useState(initialRole);
    const [sections, setSections] = useState(initialSections.map((s, index) => ({
        ...s,
        status: index === 0 ? WORKFLOW_STATUS.OPEN : WORKFLOW_STATUS.LOCKED,
        data: {},
        technicianSignature: null,
        supervisorSignature: null,
        comments: ''
    })));

    const [currentStep, setCurrentStep] = useState(0);

    // Update data for the current section
    const updateSectionData = useCallback((field, value) => {
        setSections(prev => prev.map((section, index) => {
            if (index !== currentStep) return section;
            return { ...section, data: { ...section.data, [field]: value } };
        }));
    }, [currentStep]);

    // Update signature for the current section
    const signSection = useCallback((signatureData, role) => {
        setSections(prev => prev.map((section, index) => {
            if (index !== currentStep) return section;

            const updates = {};
            if (role === ROLES.TECHNICIAN) {
                updates.technicianSignature = signatureData;
            } else if (role === ROLES.SUPERVISOR) {
                updates.supervisorSignature = signatureData;
            }
            return { ...section, ...updates };
        }));
    }, [currentStep]);

    // Advance workflow: Technician sends for review
    const submitForReview = useCallback(() => {
        setSections(prev => prev.map((section, index) => {
            if (index !== currentStep) return section;
            return { ...section, status: WORKFLOW_STATUS.REVIEW };
        }));
    }, [currentStep]);

    // Advance workflow: Supervisor approves
    const approveSection = useCallback(() => {
        setSections(prev => {
            const newSections = [...prev];
            // Approve current
            newSections[currentStep] = { ...newSections[currentStep], status: WORKFLOW_STATUS.APPROVED };

            // Unlock next if exists
            if (currentStep + 1 < newSections.length) {
                newSections[currentStep + 1] = { ...newSections[currentStep + 1], status: WORKFLOW_STATUS.OPEN };
                setCurrentStep(curr => curr + 1); // Auto-advance? Maybe optional
            }

            return newSections;
        });
    }, [currentStep]);

    // Go to specific step (only if accessible)
    const goToStep = useCallback((stepIndex) => {
        const targetSection = sections[stepIndex];
        // Allow navigation to any OPEN, REVIEW or APPROVED section
        // Or if it's the immediate next LOCKED one (though we usually keep it locked)
        // Generally, can view anything previous, but can only edit OPEN.

        setCurrentStep(stepIndex);
    }, [sections]);

    const canTechnicianEdit = sections[currentStep]?.status === WORKFLOW_STATUS.OPEN;
    const canSupervisorEdit = sections[currentStep]?.status === WORKFLOW_STATUS.REVIEW;

    return {
        // State
        sections,
        currentStep,
        activeRole,
        currentSection: sections[currentStep],

        // Computed
        canTechnicianEdit,
        canSupervisorEdit,
        isLastStep: currentStep === sections.length - 1,

        // Actions
        setActiveRole,
        updateSectionData,
        signSection,
        submitForReview,
        approveSection,
        goToStep
    };
}
