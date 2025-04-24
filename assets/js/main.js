document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuButton = document.querySelector('button[aria-controls="mobile-menu"]');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuButton && mobileMenu) {
        const menuIcon = menuButton.querySelector('.fa-bars');
        const closeIcon = menuButton.querySelector('.fa-times');
        
        menuButton.addEventListener('click', () => {
            const expanded = menuButton.getAttribute('aria-expanded') === 'true';
            
            menuButton.setAttribute('aria-expanded', !expanded);
            mobileMenu.classList.toggle('hidden');
            
            // Toggle icons
            if (menuIcon && closeIcon) {
                menuIcon.classList.toggle('hidden');
                closeIcon.classList.toggle('hidden');
            }
        });
    }

    // Smooth Scrolling & Close Mobile Menu on Link Click
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault(); // 阻止默认锚点行为
                    const navbarHeight = document.querySelector('nav')?.offsetHeight || 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 10;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (menuButton && mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        menuButton.click();
                    }
                }
            }
        });
    });
    
    // TOC Active Link Highlighting
    const tocNav = document.getElementById('toc-nav');
    if (tocNav) {
        const headings = document.querySelectorAll('article h2, article h3, article h4');
        const tocLinks = tocNav.querySelectorAll('a');
        
        if (headings.length > 0 && tocLinks.length > 0) {
            // Create a new IntersectionObserver instance
            const headingObserver = new IntersectionObserver((entries) => {
                // Get all headings that are currently visible
                const visibleHeadings = entries.filter(entry => entry.isIntersecting);
                
                if (visibleHeadings.length > 0) {
                    // Find the first visible heading
                    const firstVisibleHeading = visibleHeadings[0].target;
                    const headingId = firstVisibleHeading.id;
                    
                    // Remove active class from all links
                    tocLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Find the corresponding link and add active class
                    const activeLink = tocNav.querySelector(`a[href="#${headingId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            }, {
                rootMargin: '-80px 0px -80% 0px' // Adjust the top margin to account for sticky header
            });
            
            // Observe all headings
            headings.forEach(heading => {
                headingObserver.observe(heading);
            });
        }
    }
    
    // Add Copy Code Button to Code Blocks
    document.querySelectorAll('pre').forEach((pre) => {
        // Don't add button if it's not a code block or already has one
        if (!pre.querySelector('code') || pre.querySelector('.copy-code-button')) {
            return;
        }

        // Wrap pre in a div for positioning
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        
        // Create button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.textContent = 'Copy';
        
        // Add button
        wrapper.appendChild(copyButton);
        
        // Copy functionality
        copyButton.addEventListener('click', () => {
            const code = pre.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            }).catch((error) => {
                console.error('Failed to copy code: ', error);
                copyButton.textContent = 'Error!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            });
        });
    });
});