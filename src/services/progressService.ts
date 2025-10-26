import { prisma } from '@/lib/prisma';
import { AreaService } from './areaService';
import { FloorService } from './floorService';
import { jobSiteService } from './jobSiteService';

/**
 * Service for recalculating progress across the hierarchy
 * Tasks → Areas → Floors → Job Sites
 */
export class ProgressService {
  /**
   * Recalculate progress for a single area based on its tasks
   */
  static async recalculateAreaProgress(areaId: string): Promise<number> {
    return AreaService.calculateAreaProgress(areaId);
  }

  /**
   * Recalculate progress for a single floor based on its areas
   */
  static async recalculateFloorProgress(floorId: string): Promise<number> {
    return FloorService.calculateFloorProgress(floorId);
  }

  /**
   * Recalculate progress for a single site based on its floors
   */
  static async recalculateSiteProgress(siteId: string): Promise<number> {
    const result = await jobSiteService.calculateSiteProgress(siteId);
    return result.completionPercentage;
  }

  /**
   * Recalculate all progress from bottom to top
   * This will:
   * 1. Recalculate all areas from their tasks
   * 2. Recalculate all floors from their areas
   * 3. Recalculate all sites from their floors
   */
  static async recalculateAllProgress() {
    const startTime = Date.now();

    // Step 1: Get all areas and recalculate their progress
    const allAreas = await prisma.area.findMany({
      select: { id: true },
    });

    console.log(`Recalculating progress for ${allAreas.length} areas...`);
    const areaResults = [];
    for (const area of allAreas) {
      try {
        const progress = await AreaService.calculateAreaProgress(area.id);
        areaResults.push({ areaId: area.id, progress });
      } catch (error) {
        console.error(`Failed to calculate progress for area ${area.id}:`, error);
      }
    }

    // Step 2: Get all floors and recalculate their progress
    const allFloors = await prisma.floor.findMany({
      select: { id: true },
    });

    console.log(`Recalculating progress for ${allFloors.length} floors...`);
    const floorResults = [];
    for (const floor of allFloors) {
      try {
        const progress = await FloorService.calculateFloorProgress(floor.id);
        floorResults.push({ floorId: floor.id, progress });
      } catch (error) {
        console.error(`Failed to calculate progress for floor ${floor.id}:`, error);
      }
    }

    // Step 3: Get all job sites and recalculate their progress
    const allSites = await prisma.jobSite.findMany({
      select: { id: true },
    });

    console.log(`Recalculating progress for ${allSites.length} job sites...`);
    const siteResults = [];
    for (const site of allSites) {
      try {
        const result = await jobSiteService.calculateSiteProgress(site.id);
        siteResults.push({ siteId: site.id, progress: result.completionPercentage });
      } catch (error) {
        console.error(`Failed to calculate progress for site ${site.id}:`, error);
      }
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    return {
      success: true,
      summary: {
        areasRecalculated: areaResults.length,
        floorsRecalculated: floorResults.length,
        sitesRecalculated: siteResults.length,
        totalTime: `${duration}ms`,
      },
      details: {
        areas: areaResults,
        floors: floorResults,
        sites: siteResults,
      },
    };
  }

  /**
   * Recalculate progress for a specific job site and all its children
   */
  static async recalculateSiteHierarchy(siteId: string) {
    const startTime = Date.now();

    // Get all floors for this site
    const floors = await prisma.floor.findMany({
      where: { jobSiteId: siteId },
      include: {
        areas: {
          select: { id: true },
        },
      },
    });

    const areaResults = [];
    const floorResults = [];

    // Recalculate each floor and its areas
    for (const floor of floors) {
      // Recalculate all areas in this floor
      for (const area of floor.areas) {
        const progress = await AreaService.calculateAreaProgress(area.id);
        areaResults.push({ areaId: area.id, progress });
      }

      // Recalculate floor progress
      const floorProgress = await FloorService.calculateFloorProgress(floor.id);
      floorResults.push({ floorId: floor.id, progress: floorProgress });
    }

    // Recalculate site progress
    const siteResult = await jobSiteService.calculateSiteProgress(siteId);

    const endTime = Date.now();
    const duration = endTime - startTime;

    return {
      success: true,
      siteId,
      summary: {
        areasRecalculated: areaResults.length,
        floorsRecalculated: floorResults.length,
        siteProgress: siteResult.completionPercentage,
        totalTime: `${duration}ms`,
      },
      details: {
        areas: areaResults,
        floors: floorResults,
        site: siteResult,
      },
    };
  }
}
