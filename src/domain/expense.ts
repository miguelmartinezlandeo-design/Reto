import { ExpenseError } from "./expense-errors";

export type ExpenseCategory =
  | "travel"
  | "meals"
  | "equipment"
  | "training"
  | "personal";

export type ExpenseStatus =
  | "pending"
  | "approved"
  | "rejected";

export type ApprovalRole = "manager" | "finance";

export interface Expense {
  readonly id: string;
  readonly employeeId: string;
  readonly description: string;
  readonly category: ExpenseCategory;
  readonly amountInCents: number;
  readonly submittedAt: Date;
  readonly status: ExpenseStatus;
  readonly requiredRole: ApprovalRole | null;
}

export interface CreateExpenseData {
  readonly id: string;
  readonly employeeId: string;
  readonly description: string;
  readonly category: ExpenseCategory;
  readonly amountInCents: number;
  readonly submittedAt: Date;
}

export function createExpense(
  data: CreateExpenseData,
): Expense {
  if (data.id.trim() === "") {
    throw new ExpenseError("INVALID_EXPENSE_ID", "Expense ID cannot be empty");// el codigo de gasto no puede estar vacío
  }

  if (data.employeeId.trim() === "") {
    throw new ExpenseError("INVALID_EMPLOYEE_ID", "Employee ID cannot be empty");
  }

  if (data.description.trim() === "") {
    throw new ExpenseError("EMPTY_EXPENSE_DESCRIPTION", "Description cannot be empty");
  }

  if (
    !Number.isSafeInteger(data.amountInCents) ||
    data.amountInCents <= 0
  ) {
    throw new ExpenseError(
      "INVALID_EXPENSE_AMOUNT",
      "Amount must be a positive integer in cents",
    );
  }

  if (
    !(data.submittedAt instanceof Date) ||
    !Number.isFinite(data.submittedAt.getTime())
  ) {
    throw new ExpenseError("INVALID_SUBMISSION_DATE", "Submission date must be valid");
  }

  return {
    ...data,
    status: "pending",
    requiredRole: null,
  };
}
