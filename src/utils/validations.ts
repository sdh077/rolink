import { z } from "zod";

export const orderSubSchema = z.object({
  box: z.coerce.number(),
  box_type: z.string(),
  box_items: z.coerce.number(),
  fare: z.coerce.number(),
  fare_add: z.coerce.number(),
  fare_type: z.string(),
  invoice: z.string(),
})