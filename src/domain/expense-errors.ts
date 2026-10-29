
export type ExpenseErrorCode =
  | "INVALID_EXPENSE_ID"
  | "INVALID_EMPLOYEE_ID"
  | "EMPTY_EXPENSE_DESCRIPTION" //  Descripcion del gasto vacía
  | "INVALID_EXPENSE_AMOUNT"
  | "INVALID_SUBMISSION_DATE"; // Fecha de envío inválida

export class ExpenseError extends Error {
  constructor(
    public readonly code: ExpenseErrorCode,
    message: string,
  ) {
    super(message);

    this.name = "ExpenseError";
  }
}
