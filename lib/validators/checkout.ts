import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(7, "Phone number is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  address: z.string().min(8, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cod", "bank_transfer"]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().min(1),
        quantity: z.coerce.number().int().min(1).max(20)
      })
    )
    .min(1, "Cart is empty")
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
