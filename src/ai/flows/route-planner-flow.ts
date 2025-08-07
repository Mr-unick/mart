'use server';
/**
 * @fileOverview An AI flow for generating optimized route plans for deliveries.
 * 
 * - generateRoutePlan - A function that takes orders, drivers, and vehicles and returns an optimized route plan.
 * - GenerateRoutePlanInput - The input type for the generateRoutePlan function.
 * - GenerateRoutePlanOutput - The return type for the generateRoutePlan function.
 */

import { ai } from '@/ai/genkit';
import type { Order, Driver, Vehicle, RoutePlan } from '@/types';
import { z } from 'genkit';

const GenerateRoutePlanInputSchema = z.object({
    orders: z.array(z.custom<Order>()).describe('List of orders to be routed.'),
    drivers: z.array(z.custom<Driver>()).describe('List of available drivers.'),
    vehicles: z.array(z.custom<Vehicle>()).describe('List of available vehicles.'),
    warehouseAddress: z.string().describe('The starting and ending address for all routes (the warehouse).')
});
export type GenerateRoutePlanInput = z.infer<typeof GenerateRoutePlanInputSchema>;

const GenerateRoutePlanOutputSchema = z.array(z.custom<RoutePlan>());
export type GenerateRoutePlanOutput = z.infer<typeof GenerateRoutePlanOutputSchema>;


export async function generateRoutePlan(input: GenerateRoutePlanInput): Promise<GenerateRoutePlanOutput> {
    return generateRoutePlanFlow(input);
}

const prompt = ai.definePrompt({
    name: 'routePlannerPrompt',
    input: { schema: GenerateRoutePlanInputSchema },
    output: { schema: GenerateRoutePlanOutputSchema },
    prompt: `You are a logistics expert responsible for creating efficient delivery route plans.

Your task is to take a list of orders, a list of available drivers, and a list of available vehicles, and create a set of optimized route plans.

**Constraints and Goals:**
1.  **Efficiency:** Minimize the total travel time and distance.
2.  **Capacity:** Assume each vehicle has enough capacity for any assigned orders. For now, we are optimizing for 1 vehicle per driver.
3.  **Assignments:** Assign each selected order to exactly one driver and vehicle. Distribute the orders as evenly as possible among the available drivers.
4.  **Sequencing:** For each driver, determine the optimal sequence of delivery stops.
5.  **Start/End:** All routes must start and end at the specified warehouse address.
6.  **Output Format:** Your output MUST be a valid JSON array of RoutePlan objects. Each object must contain the driver's ID and name, the vehicle's ID and a descriptive name (make and model), and a list of stops. Each stop must have the order ID, customer name, full delivery address, and a sequence number starting from 1.

**Warehouse Location:**
{{warehouseAddress}}

**Available Drivers:**
{{#each drivers}}
- {{name}} (ID: {{id}})
{{/each}}

**Available Vehicles:**
{{#each vehicles}}
- {{make}} {{model}} (ID: {{id}}, License: {{licensePlate}})
{{/each}}

**Orders to Route:**
{{#each orders}}
- Order ID: {{id}}
  - Customer: {{customerName}}
  - Address: {{deliveryAddress.street}}, {{deliveryAddress.city}}, {{deliveryAddress.state}} {{deliveryAddress.zip}}
  - Total: {{grandTotal}}
{{/each}}
`,
});

const generateRoutePlanFlow = ai.defineFlow(
    {
        name: 'generateRoutePlanFlow',
        inputSchema: GenerateRoutePlanInputSchema,
        outputSchema: GenerateRoutePlanOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
