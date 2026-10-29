
import { describe, it, expect } from "vitest";
import { evaluateExpensePolicy } from "../../domain/expense-policy";
import { createExpense } from "../../domain/expense";
import { applyExpensePolicy } from "../../domain/expense-policy";

describe("evaluateExpensePolicy", () => {
  it("Given comidas por 45 euros, When evaluamos, Then se aprueba", () => {
    // Given
    const category = "meals";
    const amountInCents = 4500;

    // When
    const result = evaluateExpensePolicy(category, amountInCents);

    // Then
    expect(result).toEqual({ type: "approved" });
  });

  it("Given formación por 600 euros, When evaluamos, Then requiere manager", () => {
    // Given
    const category = "training";
    const amountInCents = 60000;

    // When
    const result = evaluateExpensePolicy(category, amountInCents);

    // Then
    expect(result).toEqual({
      type: "requires-approval",
      role: "manager",
    });
  });

  it("Given equipo por 1500 euros, When evaluamos, Then requiere finance", () => {
    // Given
    const category = "equipment";
    const amountInCents = 150000;

    // When
    const result = evaluateExpensePolicy(category, amountInCents);

    // Then
    expect(result).toEqual({
      type: "requires-approval",
      role: "finance",
    });
  });

  it("Given un gasto personal, When evaluamos, Then se rechaza", () => {
    // Given
    const category = "personal";
    const amountInCents = 2000;

    // When
    const result = evaluateExpensePolicy(category, amountInCents);

    // Then
    expect(result).toEqual({
      type: "rejected",
      reason: "Personal expenses are not allowed",
    });
  });
});



describe("applyExpensePolicy", () => {
  it("Given comidas por 45 euros, When aplicamos la política, Then queda aprobado", () => {
    // Given: creamos una solicitud válida.
    const expense = createExpense({
      id: "expense-10",
      employeeId: "employee-1",
      description: "Comida de trabajo",
      category: "meals",
      amountInCents: 4500,
      submittedAt: new Date("2026-10-29T10:00:00.000Z"),
    });

    // When: aplicamos la política automática.
    const result = applyExpensePolicy(expense);

    // Then: la solicitud queda aprobada.
    expect(result.expense.status).toBe("approved");
    expect(result.expense.requiredRole).toBeNull();
    expect(result.decision.type).toBe("approved");
  });

  it("Given un gasto personal, When aplicamos la política, Then queda rechazado", () => {
    // Given
    const expense = createExpense({
      id: "expense-11",
      employeeId: "employee-1",
      description: "Compra personal",
      category: "personal",
      amountInCents: 2000,
      submittedAt: new Date("2026-10-29T10:00:00.000Z"),
    });

    // When
    const result = applyExpensePolicy(expense);

    // Then
    expect(result.expense.status).toBe("rejected");
    expect(result.decision.type).toBe("rejected");
  });

  it("Given formación por 600 euros, When aplicamos la política, Then queda pendiente de manager", () => {
    // Given
    const expense = createExpense({
      id: "expense-12",
      employeeId: "employee-1",
      description: "Curso profesional",
      category: "training",
      amountInCents: 60000,
      submittedAt: new Date("2026-10-29T10:00:00.000Z"),
    });

    // When
    const result = applyExpensePolicy(expense);

    // Then
    expect(result.expense.status).toBe("pending");
    expect(result.expense.requiredRole).toBe("manager");
    expect(result.decision.type).toBe("requires-approval");
  });
});
