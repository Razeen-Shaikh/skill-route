import prisma from "@/lib/prisma";
import { QuestionType, TagType } from "@/generated/prisma";
import { categoryData } from "../data/categories";
import { companyData } from "../data/companies";
import { tagData } from "../data/tags";

export async function seedCategories() {
  console.log("🌱 Seeding quiz categories...");
  const slugToId = new Map<string, string>();

  for (const cat of categoryData.filter((c) => !("parentSlug" in c && c.parentSlug))) {
    const created = await prisma.quizCategory.create({
      data: { name: cat.name, slug: cat.slug, description: cat.description, icon: cat.icon },
    });
    slugToId.set(cat.slug, created.id);
  }

  for (const cat of categoryData.filter((c) => "parentSlug" in c && c.parentSlug)) {
    const parentSlug = (cat as { parentSlug: string }).parentSlug;
    const created = await prisma.quizCategory.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        parentId: slugToId.get(parentSlug),
      },
    });
    slugToId.set(cat.slug, created.id);
  }

  console.log(`🌱 Created ${categoryData.length} quiz categories`);
  return slugToId;
}

export async function seedCompanies() {
  console.log("🌱 Seeding companies...");
  const slugToId = new Map<string, string>();

  for (const company of companyData) {
    const created = await prisma.company.create({ data: company });
    slugToId.set(company.slug, created.id);
  }

  console.log(`🌱 Created ${companyData.length} companies`);
  return slugToId;
}

export async function seedTags() {
  console.log("🌱 Seeding tags...");
  const slugToId = new Map<string, string>();

  for (const tag of tagData) {
    const created = await prisma.tag.create({
      data: {
        name: tag.name,
        slug: tag.slug,
        type: tag.type as TagType,
      },
    });
    slugToId.set(tag.slug, created.id);
  }

  console.log(`🌱 Created ${tagData.length} tags`);
  return slugToId;
}

export type CategoryMap = Map<string, string>;
export type CompanyMap = Map<string, string>;
export type TagMap = Map<string, string>;
