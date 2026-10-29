import type { Expense } from "./expense";
import type {
  ExpenseCategory,
  ApprovalRole,
} from "./expense";

export type ExpensePolicyDecision =
  | { type: "approved" }
  | { type: "rejected"; reason: string }
  | { type: "requires-approval"; role: ApprovalRole };

export function evaluateExpensePolicy(
  category: ExpenseCategory,
  amountInCents: number,
): ExpensePolicyDecision {
  if (category === "personal") {
    return {
      type: "rejected",
      reason: "Personal expenses are not allowed",
    };
  }

  if (amountInCents <= 10000) {
    return { type: "approved" };
  }

  if (amountInCents <= 100000) {
    return {
      type: "requires-approval",
      role: "manager",
    };
  }

  return {
    type: "requires-approval",
    role: "finance",
  };
}



// Aplica la decisión de la política a una solicitud existente.
export function applyExpensePolicy(
  expense: Expense,
): {
  expense: Expense;
  decision: ExpensePolicyDecision;
} {
  // Primero calculamos la decisión según las reglas del negocio.
  const decision = evaluateExpensePolicy(
    expense.category,
    expense.amountInCents,
  );

  // Si se aprueba automáticamente, actualizamos el estado.
  if (decision.type === "approved") {
    return {
      expense: {
        ...expense,
        status: "approved",
        requiredRole: null,
      },
      decision,
    };
  }

  // Si la categoría está prohibida, se rechaza automáticamente.
  if (decision.type === "rejected") {
    return {
      expense: {
        ...expense,
        status: "rejected",
        requiredRole: null,
      },
      decision,
    };
  }

  // Si necesita aprobación manual, guardamos el rol requerido.
  return {
    expense: {
      ...expense,
      status: "pending",
      requiredRole: decision.role,
    },
    decision,
  };
}
