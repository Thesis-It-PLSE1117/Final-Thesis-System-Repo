/**
 * 
 * 
 * feature flag management for the application.
 * driven by environment variables for easy config.
 */

export const FEATURES = {
  /**
   * Wilcoxon Signed-Rank Test
   * 
   * Status: DISABLED
   * Reason: research panel recommendation, manuscript includes only paired t-test
   * 
   * To enable: Set VITE_ENABLE_WILCOXON=true in .env file
   * Emergency rollback: Change this value to true and rebuild
   */
  ENABLE_WILCOXON: import.meta.env.VITE_ENABLE_WILCOXON === 'true',
};

export default FEATURES;
