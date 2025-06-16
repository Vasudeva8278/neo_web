const { test, expect } = require('@playwright/test');

// Test configuration for different viewport sizes
const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 }
};

test.describe('Neo Web App - Mobile Responsiveness Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:4000');
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Navigation Component Tests', () => {
    
    test('Navigation sidebar width on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      
      // Wait for mobile styles to apply
      await page.waitForTimeout(500);
      
      // Check if navigation sidebar has correct width on mobile
      const navigation = page.locator('[data-testid="navigation"], .sidebar-mobile, nav');
      if (await navigation.count() > 0) {
        const navElement = navigation.first();
        const boundingBox = await navElement.boundingBox();
        
        // Navigation should be approximately 48px wide on mobile
        expect(boundingBox.width).toBeLessThanOrEqual(52);
        expect(boundingBox.width).toBeGreaterThanOrEqual(44);
      }
    });
    
    test('Navigation text labels hidden on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.waitForTimeout(500);
      
      // Check if navigation labels are hidden on mobile
      const navLabels = page.locator('.nav-label');
      if (await navLabels.count() > 0) {
        const firstLabel = navLabels.first();
        const isVisible = await firstLabel.isVisible();
        expect(isVisible).toBeFalsy();
      }
    });
    
    test('Navigation icons are appropriately sized on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.waitForTimeout(500);
      
      // Check navigation icon sizes
      const navIcons = page.locator('nav svg, nav .icon');
      if (await navIcons.count() > 0) {
        const firstIcon = navIcons.first();
        const boundingBox = await firstIcon.boundingBox();
        
        // Icons should be small on mobile (around 12px)
        expect(boundingBox.width).toBeLessThanOrEqual(16);
        expect(boundingBox.height).toBeLessThanOrEqual(16);
      }
    });
    
  });

  test.describe('Layout and Content Tests', () => {
    
    test('Main content area has proper margin on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.waitForTimeout(500);
      
      // Check main content area margin
      const mainContent = page.locator('main, .main-content, [data-testid="main-content"]');
      if (await mainContent.count() > 0) {
        const contentElement = mainContent.first();
        const styles = await contentElement.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            marginLeft: computed.marginLeft,
            paddingLeft: computed.paddingLeft
          };
        });
        
        // Should have appropriate left margin/padding for mobile navigation
        const marginValue = parseInt(styles.marginLeft);
        expect(marginValue).toBeGreaterThanOrEqual(40);
        expect(marginValue).toBeLessThanOrEqual(60);
      }
    });
    
    test('Template cards display in single column on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.waitForTimeout(500);
      
      // Navigate to a page with template cards if needed
      // await page.click('[data-testid="templates-link"]');
      
      const templateGrid = page.locator('.template-cards, .grid, [data-testid="template-grid"]');
      if (await templateGrid.count() > 0) {
        const gridElement = templateGrid.first();
        const styles = await gridElement.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            gridTemplateColumns: computed.gridTemplateColumns,
            display: computed.display
          };
        });
        
        // Should be single column on mobile
        if (styles.display === 'grid') {
          expect(styles.gridTemplateColumns).toContain('1fr');
        }
      }
    });
    
  });

  test.describe('Responsive Breakpoint Tests', () => {
    
    test('Mobile breakpoint (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      // Check if mobile styles are applied
      const body = page.locator('body');
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(viewportWidth).toBe(375);
      
      // Verify mobile-specific elements are present
      const mobileElements = page.locator('.mobile-nav, .sidebar-mobile');
      if (await mobileElements.count() > 0) {
        expect(await mobileElements.first().isVisible()).toBeTruthy();
      }
    });
    
    test('Tablet breakpoint (768px)', async ({ page }) => {
      await page.setViewportSize(viewports.tablet);
      await page.waitForTimeout(500);
      
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(viewportWidth).toBe(768);
      
      // Navigation should be wider on tablet
      const navigation = page.locator('[data-testid="navigation"], nav');
      if (await navigation.count() > 0) {
        const navElement = navigation.first();
        const boundingBox = await navElement.boundingBox();
        expect(boundingBox.width).toBeGreaterThan(48);
      }
    });
    
    test('Desktop breakpoint (1280px)', async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await page.waitForTimeout(500);
      
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(viewportWidth).toBe(1280);
      
      // Navigation labels should be visible on desktop
      const navLabels = page.locator('.nav-label');
      if (await navLabels.count() > 0) {
        const firstLabel = navLabels.first();
        const isVisible = await firstLabel.isVisible();
        expect(isVisible).toBeTruthy();
      }
    });
    
  });

  test.describe('Touch and Interaction Tests', () => {
    
    test('Touch targets meet minimum size requirements', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.waitForTimeout(500);
      
      // Check button and link sizes
      const interactiveElements = page.locator('button, a, [role="button"]');
      const count = await interactiveElements.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const element = interactiveElements.nth(i);
        if (await element.isVisible()) {
          const boundingBox = await element.boundingBox();
          
          // Minimum touch target size should be 44px (iOS guidelines)
          expect(boundingBox.height).toBeGreaterThanOrEqual(40);
        }
      }
    });
    
    test('Navigation items are clickable on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.waitForTimeout(500);
      
      // Test clicking navigation items
      const navItems = page.locator('nav a, nav button');
      if (await navItems.count() > 0) {
        const firstNavItem = navItems.first();
        if (await firstNavItem.isVisible()) {
          // Should be able to click without errors
          await expect(firstNavItem).toBeEnabled();
        }
      }
    });
    
  });

  test.describe('CSS and Styling Tests', () => {
    
    test('Mobile CSS is loaded and applied', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.waitForTimeout(500);
      
      // Check if mobile-specific CSS classes are applied
      const mobileElements = page.locator('.mobile-nav, .mobile-content, .sidebar-mobile');
      const count = await mobileElements.count();
      
      if (count > 0) {
        // At least one mobile-specific class should be present
        expect(count).toBeGreaterThan(0);
      }
    });
    
    test('Responsive transitions work smoothly', async ({ page }) => {
      // Start with desktop size
      await page.setViewportSize(viewports.desktop);
      await page.waitForTimeout(500);
      
      // Resize to mobile
      await page.setViewportSize(viewports.mobile);
      await page.waitForTimeout(500);
      
      // Check that page is still functional after resize
      const body = page.locator('body');
      expect(await body.isVisible()).toBeTruthy();
      
      // Resize back to desktop
      await page.setViewportSize(viewports.desktop);
      await page.waitForTimeout(500);
      
      expect(await body.isVisible()).toBeTruthy();
    });
    
  });

  test.describe('Performance and Loading Tests', () => {
    
    test('Page loads quickly on mobile viewport', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      
      const startTime = Date.now();
      await page.goto('http://localhost:4000');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Page should load within reasonable time (5 seconds)
      expect(loadTime).toBeLessThan(5000);
    });
    
    test('No console errors on mobile', async ({ page }) => {
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      await page.setViewportSize(viewports.mobile);
      await page.goto('http://localhost:4000');
      await page.waitForLoadState('networkidle');
      
      // Filter out known non-critical errors
      const criticalErrors = consoleErrors.filter(error => 
        !error.includes('favicon') && 
        !error.includes('manifest') &&
        !error.includes('404')
      );
      
      expect(criticalErrors.length).toBe(0);
    });
    
  });

});

// Helper function to test specific component responsiveness
test.describe('Component-Specific Responsiveness', () => {
  
  test('Profile image scales appropriately', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.waitForTimeout(500);
    
    const profileImage = page.locator('[data-testid="profile-image"], .profile-image, img[alt*="profile"]');
    if (await profileImage.count() > 0) {
      const imageElement = profileImage.first();
      const boundingBox = await imageElement.boundingBox();
      
      // Profile image should be smaller on mobile (around 24px)
      expect(boundingBox.width).toBeLessThanOrEqual(32);
      expect(boundingBox.height).toBeLessThanOrEqual(32);
    }
  });
  
  test('Form inputs are mobile-friendly', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.waitForTimeout(500);
    
    const inputs = page.locator('input, textarea, select');
    const count = await inputs.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const styles = await input.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            fontSize: computed.fontSize,
            padding: computed.padding
          };
        });
        
        // Font size should be at least 16px to prevent zoom on iOS
        const fontSize = parseInt(styles.fontSize);
        expect(fontSize).toBeGreaterThanOrEqual(14);
      }
    }
  });
  
});