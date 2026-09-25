import { PrismaClient, SkillLevel } from "@prisma/client";
import { hash } from "bcryptjs";
import {
  sampleProjects,
  skillGroups,
  milestones,
} from "../src/data/content.ts";
const prisma = new PrismaClient();
async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12)
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) before seeding.",
    );
  await prisma.$transaction(
    async (tx) => {
      await tx.user.upsert({
        where: { email },
        update: {},
        create: { email, passwordHash: await hash(password, 12) },
      });
      for (const [order, group] of skillGroups.entries()) {
        const category = await tx.skillCategory.upsert({
          where: { name: group.name },
          update: {},
          create: { name: group.name, order },
        });
        for (const [skillOrder, [name, level]] of group.skills.entries()) {
          const id = `seed-${order}-${skillOrder}`;
          await tx.skill.upsert({
            where: { id },
            update: {},
            create: {
              id,
              name,
              level: level as SkillLevel,
              order: skillOrder,
              categoryId: category.id,
            },
          });
        }
      }
      for (const [order, milestone] of milestones.entries())
        await tx.milestone.upsert({
          where: { id: `seed-milestone-${order}` },
          update: {},
          create: { id: `seed-milestone-${order}`, ...milestone, order },
        });
      for (const [order, project] of sampleProjects.entries())
        await tx.project.upsert({
          where: { slug: project.slug },
          update: {},
          create: {
            ...project,
            tools: [...project.tools],
            order,
            published: true,
            featured: true,
          },
        });
    },
    { timeout: 30000 },
  );
  console.log(
    "Seed complete. Existing content and passwords were preserved. Sample projects are explicitly labeled.",
  );
}
main()
  .catch(() => {
    console.error(
      "Seed failed. Check database connectivity and admin environment values.",
    );
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
