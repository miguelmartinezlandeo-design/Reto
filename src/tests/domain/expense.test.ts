import { describe, it, expect } from "vitest";
import { ExpenseError } from "../../domain/expense-errors";
import { createExpense } from "../../domain/expense";

describe("Expense", () => {

it("Given un importe cero, When creamos un gasto, Then devuelve un error de importe", () => {
  // Given
  const data = {
    id: "expense-2",
    employeeId: "employee-1",
    description: "Comida de trabajo",
    category: "meals" as const,
    amountInCents: 0,
    submittedAt: new Date("2026-10-29T10:00:00.000Z"),
  };

  // When / Then
  try {
    createExpense(data);
    throw new Error("Expected createExpense to fail");
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(ExpenseError);

    if (error instanceof ExpenseError) {
      expect(error.code).toBe("INVALID_EXPENSE_AMOUNT");
    }
  }
});

it("Given una descripción vacía, When creamos un gasto, Then devuelve un error de descripción", () => {
  // Given
  const data = {
    id: "expense-3",
    employeeId: "employee-1",
    description: "   ",
    category: "meals" as const,
    amountInCents: 4500,
    submittedAt: new Date("2026-10-29T10:00:00.000Z"),
  };

  // When / Then
  try {
    createExpense(data);
    throw new Error("Expected createExpense to fail");
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(ExpenseError);

    if (error instanceof ExpenseError) {
      expect(error.code).toBe("EMPTY_EXPENSE_DESCRIPTION");
    }
  }
});

});