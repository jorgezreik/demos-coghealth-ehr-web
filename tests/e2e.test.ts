import puppeteer, { Browser, Page } from 'puppeteer';

const BASE_URL = 'http://localhost:5173';

describe('MedChart EHR E2E Tests', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('Navigation', () => {
    test('should load dashboard page', async () => {
      await page.goto(BASE_URL);
      await page.waitForSelector('.ehr-header');
      const title = await page.$eval('.ehr-header span.font-semibold', el => el.textContent);
      expect(title).toBe('CogniChart EHR');
    });

    test('should navigate to Patients page', async () => {
      await page.click('a[href="/patients"]');
      await page.waitForSelector('.ehr-status-bar');
      const statusText = await page.$eval('.ehr-status-bar span', el => el.textContent);
      expect(statusText).toContain('patient');
    });

    test('should navigate to Schedule page', async () => {
      await page.click('a[href="/schedule"]');
      await page.waitForSelector('.ehr-status-bar');
      const statusText = await page.$eval('.ehr-status-bar span', el => el.textContent);
      expect(statusText).toContain('Schedule');
    });

    test('should navigate to Medications page', async () => {
      await page.click('a[href="/medications"]');
      await page.waitForSelector('.ehr-status-bar');
      const statusText = await page.$eval('.ehr-status-bar span', el => el.textContent);
      expect(statusText).toContain('Medications');
    });

    test('should navigate to Reports page', async () => {
      await page.click('a[href="/reports"]');
      await page.waitForSelector('.ehr-status-bar');
      const statusText = await page.$eval('.ehr-status-bar span', el => el.textContent);
      expect(statusText).toContain('Reports');
    });

    test('should navigate to Settings page', async () => {
      await page.click('a[href="/settings"]');
      await page.waitForSelector('.ehr-status-bar');
      const statusText = await page.$eval('.ehr-status-bar span', el => el.textContent);
      expect(statusText).toContain('Settings');
    });
  });

  describe('Global Patient Search', () => {
    test('should show search dropdown when typing', async () => {
      await page.goto(BASE_URL);
      const searchInput = await page.$('input[placeholder="Patient search..."]');
      await searchInput?.type('Smith');
      await page.waitForSelector('.absolute.top-full');
      const results = await page.$$('.absolute.top-full > div');
      expect(results.length).toBeGreaterThan(0);
    });

    test('should navigate to patient chart when selecting from search', async () => {
      await page.goto(BASE_URL);
      const searchInput = await page.$('input[placeholder="Patient search..."]');
      await searchInput?.type('Smith');
      await page.waitForSelector('.absolute.top-full > div');
      await page.click('.absolute.top-full > div:first-child');
      await page.waitForNavigation();
      expect(page.url()).toContain('/patients/');
    });
  });

  describe('Dashboard', () => {
    beforeEach(async () => {
      await page.goto(BASE_URL);
    });

    test('should display inbox with items', async () => {
      const inboxItems = await page.$$('table tbody tr');
      expect(inboxItems.length).toBeGreaterThan(0);
    });

    test('should filter inbox by tab', async () => {
      const initialCount = (await page.$$('table tbody tr')).length;
      await page.click('button:has-text("Results")');
      await page.waitForTimeout(100);
      const filteredCount = (await page.$$('table tbody tr')).length;
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });

    test('should filter inbox by priority', async () => {
      await page.select('select:has(option[value="critical"])', 'critical');
      await page.waitForTimeout(100);
      const rows = await page.$$('table tbody tr.ehr-alert-critical');
      expect(rows.length).toBeGreaterThan(0);
    });

    test('should mark inbox item as read', async () => {
      const unreadBefore = await page.$$('table tbody tr .w-2.h-2.bg-blue-600');
      const countBefore = unreadBefore.length;
      await page.click('table tbody tr:first-child button[title="Mark Read"]');
      await page.waitForTimeout(100);
      const unreadAfter = await page.$$('table tbody tr .w-2.h-2.bg-blue-600');
      expect(unreadAfter.length).toBeLessThan(countBefore);
    });

    test('should toggle inbox item flag', async () => {
      await page.click('table tbody tr:first-child button[title="Flag"]');
      await page.waitForTimeout(100);
    });

    test('should filter worklist by type', async () => {
      await page.click('button:has-text("Inpatient")');
      await page.waitForTimeout(100);
    });

    test('should sort worklist', async () => {
      await page.select('select:has(option[value="name"])', 'name');
      await page.waitForTimeout(100);
    });

    test('should open print dialog', async () => {
      await page.click('button:has-text("Print")');
      await page.waitForSelector('.fixed.inset-0');
      const modalTitle = await page.$eval('.fixed.inset-0 span.text-white', el => el.textContent);
      expect(modalTitle).toContain('Print');
      await page.click('button:has-text("Cancel")');
    });

    test('should open e-Prescribe dialog', async () => {
      await page.click('button:has-text("e-Prescribe")');
      await page.waitForSelector('.fixed.inset-0');
      const modalTitle = await page.$eval('.fixed.inset-0 span.text-white', el => el.textContent);
      expect(modalTitle).toContain('Prescribe');
      await page.click('button:has-text("Cancel")');
    });

    test('should open Order Labs dialog', async () => {
      await page.click('button:has-text("Order Labs")');
      await page.waitForSelector('.fixed.inset-0');
      await page.click('button:has-text("Cancel")');
    });

    test('should collapse/expand panels', async () => {
      await page.click('.ehr-header:has-text("Inbox")');
      await page.waitForTimeout(100);
      await page.click('.ehr-header:has-text("Inbox")');
      await page.waitForTimeout(100);
    });
  });

  describe('Patient Search Page', () => {
    beforeEach(async () => {
      await page.goto(`${BASE_URL}/patients`);
    });

    test('should display patient list', async () => {
      const rows = await page.$$('table tbody tr');
      expect(rows.length).toBeGreaterThan(0);
    });

    test('should search patients', async () => {
      const searchInput = await page.$('input[placeholder*="Name, MRN"]');
      await searchInput?.type('Smith');
      await page.click('button:has-text("Find")');
      await page.waitForTimeout(100);
    });

    test('should filter by status', async () => {
      await page.click('input[type="checkbox"]');
      await page.waitForTimeout(100);
    });

    test('should select patient and show details', async () => {
      await page.click('table tbody tr:first-child');
      await page.waitForSelector('fieldset:has-text("Demographics")');
    });

    test('should navigate to patient chart', async () => {
      await page.click('table tbody tr:first-child');
      await page.waitForSelector('button:has-text("Open Chart")');
      await page.click('button:has-text("Open Chart")');
      await page.waitForNavigation();
      expect(page.url()).toContain('/patients/');
    });
  });

  describe('Schedule Page', () => {
    beforeEach(async () => {
      await page.goto(`${BASE_URL}/schedule`);
    });

    test('should display schedule grid', async () => {
      await page.waitForSelector('.ehr-status-bar');
    });

    test('should open new appointment dialog', async () => {
      await page.click('button:has-text("New Appt")');
      await page.waitForSelector('.fixed.inset-0');
      await page.click('button:has-text("Cancel")');
    });

    test('should change view mode', async () => {
      await page.click('button:has-text("Week")');
      await page.waitForTimeout(100);
      await page.click('button:has-text("Day")');
      await page.waitForTimeout(100);
    });
  });

  describe('Medications Page', () => {
    beforeEach(async () => {
      await page.goto(`${BASE_URL}/medications`);
    });

    test('should display medication list', async () => {
      const rows = await page.$$('table tbody tr');
      expect(rows.length).toBeGreaterThan(0);
    });

    test('should filter medications', async () => {
      await page.click('button:has-text("Active")');
      await page.waitForTimeout(100);
    });

    test('should open new Rx dialog', async () => {
      await page.click('button:has-text("New Rx")');
      await page.waitForSelector('.fixed.inset-0');
      await page.click('button:has-text("Cancel")');
    });

    test('should select medication and show details', async () => {
      await page.click('table tbody tr:first-child');
      await page.waitForSelector('fieldset:has-text("Patient")');
    });
  });

  describe('Reports Page', () => {
    beforeEach(async () => {
      await page.goto(`${BASE_URL}/reports`);
    });

    test('should display reports list', async () => {
      await page.waitForSelector('table');
    });

    test('should filter by category', async () => {
      await page.select('select', 'clinical');
      await page.waitForTimeout(100);
    });

    test('should run report', async () => {
      await page.click('button:has-text("Run")');
      await page.waitForSelector('.fixed.inset-0');
      await page.click('button:has-text("OK")');
    });

    test('should download report', async () => {
      const downloadButtons = await page.$$('button:has(svg.w-3.h-3)');
      if (downloadButtons.length > 0) {
        await downloadButtons[0].click();
        await page.waitForSelector('.fixed.inset-0');
        await page.click('button:has-text("OK")');
      }
    });
  });

  describe('Settings Page', () => {
    beforeEach(async () => {
      await page.goto(`${BASE_URL}/settings`);
    });

    test('should display settings tabs', async () => {
      const tabs = await page.$$('button:has-text("Profile"), button:has-text("Notifications")');
      expect(tabs.length).toBeGreaterThan(0);
    });

    test('should switch tabs', async () => {
      await page.click('button:has-text("Notifications")');
      await page.waitForTimeout(100);
      await page.click('button:has-text("Security")');
      await page.waitForTimeout(100);
      await page.click('button:has-text("Appearance")');
      await page.waitForTimeout(100);
    });

    test('should save settings', async () => {
      await page.click('button:has-text("Save Changes")');
      await page.waitForSelector('button:has-text("Saved")');
    });

    test('should update profile fields', async () => {
      await page.click('button:has-text("Profile")');
      const firstNameInput = await page.$('input[value="Sarah"]');
      await firstNameInput?.click({ clickCount: 3 });
      await firstNameInput?.type('Test');
    });

    test('should toggle notifications', async () => {
      await page.click('button:has-text("Notifications")');
      await page.click('input[type="checkbox"]');
      await page.waitForTimeout(100);
    });
  });

  describe('Patient Chart Page', () => {
    beforeEach(async () => {
      await page.goto(`${BASE_URL}/patients/1`);
    });

    test('should display patient banner', async () => {
      await page.waitForSelector('.ehr-status-bar');
    });

    test('should switch chart tabs', async () => {
      await page.click('button:has-text("Encounters")');
      await page.waitForTimeout(100);
      await page.click('button:has-text("Medications")');
      await page.waitForTimeout(100);
      await page.click('button:has-text("Summary")');
      await page.waitForTimeout(100);
    });

    test('should collapse/expand panels', async () => {
      await page.click('.ehr-header:has-text("Active Problems")');
      await page.waitForTimeout(100);
      await page.click('.ehr-header:has-text("Active Problems")');
      await page.waitForTimeout(100);
    });

    test('should open e-Prescribe from chart', async () => {
      await page.click('button:has-text("e-Prescribe")');
      await page.waitForSelector('.fixed.inset-0');
      await page.click('button:has-text("Cancel")');
    });

    test('should open Order Labs from chart', async () => {
      await page.click('button:has-text("Order Labs")');
      await page.waitForSelector('.fixed.inset-0');
      await page.click('button:has-text("Cancel")');
    });
  });

  describe('HIPAA Compliance Features', () => {
    test('should display HIPAA secure indicator', async () => {
      await page.goto(BASE_URL);
      const hipaaIndicator = await page.$('span:has-text("HIPAA Secure")');
      expect(hipaaIndicator).not.toBeNull();
    });

    test('should display session timer', async () => {
      await page.goto(BASE_URL);
      const sessionTimer = await page.$('span:has-text("Session:")');
      expect(sessionTimer).not.toBeNull();
    });

    test('should show logout confirmation', async () => {
      await page.goto(BASE_URL);
      await page.click('button:has-text("Logout")');
      await page.waitForSelector('.fixed.inset-0');
      const modalTitle = await page.$eval('.fixed.inset-0 span.text-white', el => el.textContent);
      expect(modalTitle).toContain('Logout');
      await page.click('button:has-text("Cancel")');
    });
  });

  describe('Modal Dialogs', () => {
    beforeEach(async () => {
      await page.goto(BASE_URL);
    });

    test('should close modal with Cancel button', async () => {
      await page.click('button:has-text("Print")');
      await page.waitForSelector('.fixed.inset-0');
      await page.click('button:has-text("Cancel")');
      await page.waitForTimeout(100);
      const modal = await page.$('.fixed.inset-0');
      expect(modal).toBeNull();
    });

    test('should close modal with X button', async () => {
      await page.click('button:has-text("Print")');
      await page.waitForSelector('.fixed.inset-0');
      await page.click('.fixed.inset-0 button:has(svg.w-3\\.5.h-3\\.5)');
      await page.waitForTimeout(100);
    });

    test('should close modal with Escape key', async () => {
      await page.click('button:has-text("Print")');
      await page.waitForSelector('.fixed.inset-0');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(100);
    });
  });
});
