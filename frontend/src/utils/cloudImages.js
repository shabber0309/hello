/**
 * Live Fix - Cloud Image CDN Resolver
 * Direct Google Drive Edge CDN delivery for high-performance asset loading
 * Eliminates server outbound bandwidth and drastically accelerates page speeds.
 */

const DRIVE_CDN_BASE = 'https://drive.google.com/thumbnail?id=';
const DEFAULT_SIZE = '&sz=w800';

export const CLOUD_IMAGE_IDS = {
  // Brand & Model Laptops (Curated Primary Catalog)
  'acer_nitro_5_real.jpg': '1YxwY632rBgsdRm4AdEl4Q825NGb3NU6g',
  'acer_nitro_5.jpg': '1uOYqTxAt-kQZmKpWErKrYAxmTIbFrypt',
  'acer_nitro_5.png': '1sEXcsHWhZ9zy3otOTj1fZnfvm4qzcOyA',
  'acer_swift_3.jpg': '1wULWzwZJfmT-rJ1KLZ1ITvWSdXPXaGXp',
  'apple_macbook_air_m1.png': '1O_6Dd2m2a-TuLHC8U5bWo_vZ8DprCo8M',
  'apple_macbook_air_m2.jpg': '1h7LEGeFQuBUaMOCW6LyiUsiOu3NpmmL9',
  'apple_macbook_pro_16.jpg': '1EAA03OKcQPEaWa9yHraXW_7NydLDjfGc',
  'apple_macbook_pro_m3.jpg': '1w3775XoC-jeyPjr6A4vWcvQ2kr1E66E9',
  'apple_macbook_pro.jpg': '1-RyxzF5n0Rntz83aqBbky2EAhAc_mww9',
  'asus_rog_gaming.jpg': '1qIyrDntvan32oG9SQ2ExpzZbxD0PzjNe',
  'asus_rog_zephyrus.jpg': '1xzPF32l6GGwQkRA8rLsSaOtIH85Qx9v2',
  'asus_tuf_gaming.jpg': '1OsmA4yKuArbgLXl4dBSZg_7HdNgqEKR4',
  'asus_zenbook_14.jpg': '1BV0fD50d2eqKNoXJCHawvtZFfPR6Brxl',
  'asus_zenbook_alpha.png': '1EtBBFwK629cIkZhpOHzY-AnAvmej2gsv',
  'asus_zenbook_duo.jpg': '18xXtSw0ndcarMpdTVDeGIfNoQK_0ODeD',
  'dell_inspiron_15.jpg': '1eI8T4q1hpx_pO-FGmSUzxbs_t5MS5gZ3',
  'dell_xps_13.jpg': '1QeN0B7SGCTjiyNGcYodG94Aal3PqXCnj',
  'dell_xps_13.png': '1rJgoJxzoxyhGpyUf4kmctQjTx1NEYSPX',
  'dell_xps_15.jpg': '1h93nSsD1eYiImnN90A6dWvm2g0o8SAau',
  'generic_ultrabook.jpg': '1mhtBHANiZLZ4FFnLIvRK6Rn5iyPD3n_7',
  'gigabyte_aero_16.jpg': '1B7kPnbynFjc85X-O-_NjS4CpViN_sxJh',
  'gigabyte_aorus_15.jpg': '1VeoCIQXhRVJRCQFzgy-iVL5BkQH9yCdU',
  'gigabyte_g5.jpg': '12SMabuTkPOv5VXJLMSOWKmUoWiEqcrfC',
  'hp_14s.jpg': '1C2Dp7bZAQWYBhx4CQM0vPTM-sskACzr4',
  'hp_15_da.jpg': '1TvDOuHLXmRn9cMQaEhC8dvad0L2poowv',
  'hp_15_dy.jpg': '1Fos1Zd5TvyMgRkXf3IjPQnAyTZJkE2g7',
  'hp_elitebook_840.png': '1ytd6JmzIuzRxLSy858fwSdvKheYoz5rI',
  'hp_envy_14.jpg': '1khCqPzeSnuFSPCWJWSL0QZcjJbsSAXLt',
  'hp_pavilion_15.jpg': '1dTTnfIfjL3sS63Z-aTMed3nzsRqFCbWo',
  'hp_spectre_x360.jpg': '1XVdtxLaiW0kyUNHNeCJQiSzfP-2rFwHL',
  'hp_victus_15.jpg': '1wQUbjwPupAyAVgENSJpkGWMlXK8cHHuR',
  'lenovo_ideapad_110.jpg': '1p9GyasNhBvTjRdvEwpLsh4WfD1ywwEKI',
  'lenovo_thinkpad_x1_carbon.jpg': '14cGumkQ6xqbp6FDqqA20MvSYBgKXs8oI',
  'lenovo_thinkpad_x1_gen7.jpg': '1SzNNLGqm06FtBCxWr8wrOTUsURgHoIbA',
  'lenovo_thinkpad_x1.jpg': '1sjm6gIEJvCafKY26MCIH1AJOnOg7sG2J',
  'lenovo_yoga_6.jpg': '1v_I08dS8E7keT-joe5hNte87gksa69l5',
  'samsung_galaxy_book.jpg': '1ZbP7nCfDW1iB0ZLVn_7Y43iWfM6UAkRI',
  'surface_laptop.jpg': '1G2PZfIfomRkPClqXa6Bknx6ZRVt6Jstk',
  'surface_laptop.png': '1HjID2q6Nbx1dcZgpl5bM7HHKUZWuaEgt',

  // Core Platform Graphics & Textures
  'hero_laptop.jpg': '1xTzeA9nkv6RLuyVAOJDfkuKaCJf7fPIx',
  'livefix-logo.png': '15_N0scvyb2MdyaqLr-_zPcm9bTvYyon7',
  'microscope_chip.jpg': '1UKWdQdR3ymmzLXTf-0edErnRWXwSzKIK',
  'pcb_repair_chip.jpg': '1EiRRnmh-BPfvbGP2Sl3bqr1Oh4WKVbhi',
  'tech_bench_live.jpg': '1f9wmolk8aMlwI0l1xM41ptOBeLvHJgfE',
  'workbench_mat_bg.jpg': '1UIbhiUOfrJ93Jc-Ab89xMPvYl5VE_bVo'
};

/**
 * Resolves an image path (e.g., '/laptops/models/dell_xps_13.png' or 'hero_laptop.jpg')
 * to its direct high-speed Google Drive CDN link.
 * Falls back to the original local asset path if no cloud ID exists.
 *
 * @param {string} rawPath - Asset path or filename
 * @param {string} [customSize='&sz=w800'] - Custom sizing parameter (e.g. '&sz=w1200')
 * @returns {string} Fully resolved CDN URL or original fallback path
 */
export function getCloudImageUrl(rawPath, customSize = DEFAULT_SIZE) {
  if (!rawPath || typeof rawPath !== 'string') {
    return rawPath || '';
  }

  // Already a full remote URL
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
    return rawPath;
  }

  // Extract filename in lowercase
  const filename = rawPath.split('/').pop().toLowerCase().trim();

  const driveId = CLOUD_IMAGE_IDS[filename];
  if (driveId) {
    return `${DRIVE_CDN_BASE}${driveId}${customSize}`;
  }

  return rawPath;
}

export default getCloudImageUrl;
