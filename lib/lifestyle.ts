export type ArticleStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED';

export interface TransitionContext {
  currentStatus: ArticleStatus;
  targetStatus: ArticleStatus;
  userId: string;
  authorId: string;
  userRole: 'EDITOR' | 'WRITER';
  publishTime?: Date | null;
}

export function validateStatusTransition(ctx: TransitionContext): { valid: boolean; reason?: string } {
  const { currentStatus, targetStatus, userId, authorId, userRole, publishTime } = ctx;

  // Rule 1: Writers cannot approve, publish, schedule, or unpublish
  if (userRole !== 'EDITOR' && ['APPROVED', 'SCHEDULED', 'PUBLISHED'].includes(targetStatus)) {
    return { valid: false, reason: 'Only editors can approve, schedule, publish, or unpublish articles.' };
  }

  // Rule 2: Authors CAN NEVER approve their own work
  if (targetStatus === 'APPROVED' && userId === authorId) {
    return { valid: false, reason: 'An editor cannot approve an article they authored.' };
  }

  // State Transition Rules
  switch (currentStatus) {
    case 'DRAFT':
      if (targetStatus === 'IN_REVIEW') return { valid: true };
      return { valid: false, reason: 'Draft articles can only be submitted for In Review.' };

    case 'IN_REVIEW':
      if (targetStatus === 'APPROVED') return { valid: true };
      return { valid: false, reason: 'In Review articles can only move to Approved.' };

    case 'APPROVED':
      if (targetStatus === 'SCHEDULED') {
        if (!publishTime || new Date(publishTime) <= new Date()) {
          return { valid: false, reason: 'Scheduled articles require a future publish time.' };
        }
        return { valid: true };
      }
      if (targetStatus === 'PUBLISHED') return { valid: true };
      if (targetStatus === 'IN_REVIEW') return { valid: true }; // Content edit trigger
      return { valid: false, reason: 'Approved articles can only be Scheduled, Published, or sent back to In Review.' };

    case 'SCHEDULED':
      if (targetStatus === 'APPROVED') return { valid: true }; // Unpublish action
      if (targetStatus === 'PUBLISHED') return { valid: true };
      if (targetStatus === 'IN_REVIEW') return { valid: true }; // Content edit trigger
      return { valid: false, reason: 'Scheduled articles can only be Published, Unpublished back to Approved, or sent back to In Review.' };

    case 'PUBLISHED':
      if (targetStatus === 'APPROVED') return { valid: true }; // Unpublish action
      return { valid: false, reason: 'Published articles cannot change content directly; open a new revision instead.' };

    default:
      return { valid: false, reason: 'Invalid transition state.' };
  }
}