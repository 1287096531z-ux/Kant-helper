import { PrismaClient } from "@prisma/client";
import { issues, paths, philosopher, relations, scholars, works } from "../lib/data/seed";

const prisma = new PrismaClient();

async function main() {
  await prisma.philosopher.upsert({ where: { id: philosopher.id }, update: philosopher, create: philosopher });

  await prisma.issue.deleteMany();
  await prisma.researchPath.deleteMany();
  await prisma.scholar.deleteMany();
  await prisma.work.deleteMany();
  await prisma.relation.deleteMany();

  for (const issue of issues) {
    await prisma.issue.create({
      data: {
        id: issue.id,
        label: issue.label,
        title: issue.title,
        summary: issue.summary,
        weight: issue.weight,
        termIds: JSON.stringify(issue.termIds),
        pathIds: JSON.stringify(paths.filter((path) => path.issueId === issue.id).map((path) => path.id))
      }
    });
  }

  for (const path of paths) {
    await prisma.researchPath.create({
      data: {
        id: path.id,
        issueId: path.issueId,
        label: path.label,
        summary: path.summary,
        stance: path.stance,
        scholarIds: JSON.stringify(path.scholarIds),
        highlights: JSON.stringify(path.highlights)
      }
    });
  }

  for (const scholar of scholars) {
    await prisma.scholar.create({
      data: {
        id: scholar.id,
        slug: scholar.slug,
        name: scholar.name,
        nameZh: scholar.nameZh,
        region: scholar.region,
        institution: scholar.institution,
        eraFocus: scholar.eraFocus,
        summary: scholar.summary,
        biography: scholar.biography,
        tags: JSON.stringify(scholar.tags),
        termIds: JSON.stringify(scholar.termIds),
        issueIds: JSON.stringify(scholar.issueIds),
        pathIds: JSON.stringify(scholar.pathIds),
        workIds: JSON.stringify(scholar.workIds),
        geoX: scholar.geo.x,
        geoY: scholar.geo.y,
        sepUrl: scholar.sep?.url
      }
    });
  }

  for (const work of works) {
    await prisma.work.create({
      data: {
        id: work.id,
        title: work.title,
        titleZh: work.titleZh,
        year: work.year,
        venue: work.venue,
        doi: work.doi,
        cnkiId: work.cnkiId,
        source: work.source,
        citationCount: work.citationCount,
        authors: JSON.stringify(work.authors),
        abstract: work.abstract,
        url: work.url,
        keywords: JSON.stringify(work.keywords),
        termIds: JSON.stringify(work.termIds),
        scholarIds: JSON.stringify(work.scholarIds)
      }
    });
  }

  for (const [index, relation] of relations.entries()) {
    await prisma.relation.create({ data: { id: `rel-${index + 1}`, ...relation } });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
