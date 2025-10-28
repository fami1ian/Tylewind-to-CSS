// ============================================
// LAZY LOADING UTILITY
// ============================================

function setupLazyImage(img) {
    if (!img) return;

    img.setAttribute('loading', 'lazy');
    img.classList.add('img-placeholder');

    img.addEventListener('load', function () {
        this.classList.remove('img-placeholder');
        this.classList.add('loaded');
    }, { once: true });

    img.addEventListener('error', function () {
        this.classList.remove('img-placeholder');
        console.warn('Failed to load image:', this.src);
    }, { once: true });
}

// ============================================
// PHONE NUMBER COPY FUNCTIONALITY
// ============================================

function initPhoneCopy() {
    const phoneElement = document.getElementById('phoneNumber');
    if (!phoneElement) return;

    let notificationTimeout;
    let hideTimeout;

    phoneElement.addEventListener('click', function (e) {
        e.stopPropagation();
        const phoneText = this.textContent.trim();
        const phoneNumber = phoneText.replace(/\s+/g, '');

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(phoneNumber).then(() => {
                showCopyNotification(phoneElement);
            }).catch(err => {
                console.error('Failed to copy:', err);
                fallbackCopy(phoneNumber, phoneElement);
            });
        } else {
            fallbackCopy(phoneNumber, phoneElement);
        }
    });

    function fallbackCopy(text, parentElement) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showCopyNotification(parentElement);
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        document.body.removeChild(textarea);
    }

    function showCopyNotification(parentElement) {
        clearTimeout(notificationTimeout);
        clearTimeout(hideTimeout);

        const existingNotification = parentElement.querySelector('.copy-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.innerHTML = `
            <div class="copy-notification-icon">
                <svg fill="#b9e49f" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 416.979 416.979" xml:space="preserve" stroke="#b9e49f"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85 c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786 c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576 c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765 c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"></path> </g> </g></svg>
            </div>
            <span>Номер скопирован</span>
            <button class="copy-notification-close" type="button">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;

        parentElement.appendChild(notification);

        const closeBtn = notification.querySelector('.copy-notification-close');
        closeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            closeNotification(notification);
        });

        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        notificationTimeout = setTimeout(() => {
            closeNotification(notification);
        }, 5000);
    }

    function closeNotification(notification) {
        clearTimeout(notificationTimeout);
        clearTimeout(hideTimeout);

        notification.classList.remove('show');
        notification.classList.add('hide');

        hideTimeout = setTimeout(() => {
            if (notification && notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }
}

// ============================================
// MODALS & DROPDOWNS SYSTEM
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize phone copy functionality
    initPhoneCopy();

    // ============================================
    // 1. MAIN MODALS (Full Screen)
    // ============================================

    // Special handling for projectMenuModal with hover
    const projectMenuTrigger = document.querySelector('[data-modal-target="#projectMenuModal"]');
    const projectMenuModal = document.getElementById('projectMenuModal');
    const actualMenu = document.querySelector("#actualMenu");

    if (projectMenuTrigger && projectMenuModal) {
        let hideModalTimeout;
        let isModalOpen = false;

        // Add initial styles for animation
        const modalContent = projectMenuModal.querySelector('.flex.gap-2');
        if (modalContent) {
            modalContent.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        }

        // Function to show modal with animation
        const showModal = () => {
            clearTimeout(hideModalTimeout);
            isModalOpen = true;
            projectMenuModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            // Trigger animation
            if (modalContent) {
                modalContent.style.opacity = '0';
                modalContent.style.transform = 'translateY(-10px)';

                requestAnimationFrame(() => {
                    modalContent.style.opacity = '1';
                    modalContent.style.transform = 'translateY(0)';
                });
            }
        };

        // Function to hide modal with animation
        const hideModal = () => {
            isModalOpen = false;

            if (modalContent) {
                modalContent.style.opacity = '0';
                modalContent.style.transform = 'translateY(-10px)';
            }

            setTimeout(() => {
                if (!isModalOpen) {
                    projectMenuModal.classList.add('hidden');
                    document.body.style.overflow = '';
                }
            }, 300);
        };

        // Show modal on hover over trigger
        projectMenuTrigger.addEventListener('mouseenter', () => {
            showModal();
        });

        // Keep modal open when hovering over trigger
        projectMenuTrigger.addEventListener('mouseleave', () => {
            hideModalTimeout = setTimeout(() => {
                hideModal();
            }, 150);
        });

        // Keep modal open when hovering over modal itself
        projectMenuModal.addEventListener('mouseenter', () => {
            clearTimeout(hideModalTimeout);
            isModalOpen = true;
        });

        // Hide modal when leaving modal
        actualMenu.addEventListener('mouseleave', () => {
            hideModalTimeout = setTimeout(() => {
                hideModal();
            }, 150);
        });

        // Close modal when hovering over anything except trigger and modal
        document.addEventListener('mouseover', (e) => {
            if (!isModalOpen) return;

            // Check if hovering over trigger or modal
            const isOverTrigger = projectMenuTrigger.contains(e.target);
            const isOverModal = projectMenuModal.contains(e.target);

            // If not hovering over trigger or modal, close it
            if (!isOverTrigger && !isOverModal) {
                clearTimeout(hideModalTimeout);
                hideModal();
            }
        });

        // Also allow click to open (for touch devices)
        projectMenuTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            if (projectMenuModal.classList.contains('hidden')) {
                showModal();
            } else {
                hideModal();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isModalOpen) {
                hideModal();
            }
        });
    }

    // Special handling for mortgageCalcModal with hover
    const mortgageCalcTrigger = document.querySelector('[data-modal-target="#mortgageCalcModal"]');
    const mortgageCalcModal = document.getElementById('mortgageCalcModal');
    const actualMortgage = document.querySelector("#actualMortage");

    if (mortgageCalcTrigger && mortgageCalcModal) {
        let hideMortgageTimeout;
        let isMortgageModalOpen = false;

        // Add initial styles for animation
        const mortgageContent = mortgageCalcModal.querySelector('.flex.max-w-\\[1540px\\]');
        if (mortgageContent) {
            mortgageContent.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        }

        // Function to show modal with animation
        const showMortgageModal = () => {
            clearTimeout(hideMortgageTimeout);
            isMortgageModalOpen = true;
            mortgageCalcModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            // Trigger animation
            if (mortgageContent) {
                mortgageContent.style.opacity = '0';
                mortgageContent.style.transform = 'translateY(-10px)';

                requestAnimationFrame(() => {
                    mortgageContent.style.opacity = '1';
                    mortgageContent.style.transform = 'translateY(0)';
                });
            }
        };

        // Function to hide modal with animation
        const hideMortgageModal = () => {
            isMortgageModalOpen = false;

            if (mortgageContent) {
                mortgageContent.style.opacity = '0';
                mortgageContent.style.transform = 'translateY(-10px)';
            }

            setTimeout(() => {
                if (!isMortgageModalOpen) {
                    mortgageCalcModal.classList.add('hidden');
                    document.body.style.overflow = '';
                }
            }, 300);
        };

        // Show modal on hover over trigger
        mortgageCalcTrigger.addEventListener('mouseenter', () => {
            showMortgageModal();
        });

        // Keep modal open when hovering over trigger
        mortgageCalcTrigger.addEventListener('mouseleave', () => {
            hideMortgageTimeout = setTimeout(() => {
                hideMortgageModal();
            }, 150);
        });

        // Keep modal open when hovering over modal itself
        mortgageCalcModal.addEventListener('mouseenter', () => {
            clearTimeout(hideMortgageTimeout);
            isMortgageModalOpen = true;
        });

        // Hide modal when leaving actualMortgage area
        if (actualMortgage) {
            actualMortgage.addEventListener('mouseleave', () => {
                hideMortgageTimeout = setTimeout(() => {
                    hideMortgageModal();
                }, 150);
            });
        }

        // Close modal when hovering over anything except trigger and modal
        document.addEventListener('mouseover', (e) => {
            if (!isMortgageModalOpen) return;

            // Check if hovering over trigger or modal
            const isOverTrigger = mortgageCalcTrigger.contains(e.target);
            const isOverModal = mortgageCalcModal.contains(e.target);

            // If not hovering over trigger or modal, close it
            if (!isOverTrigger && !isOverModal) {
                clearTimeout(hideMortgageTimeout);
                hideMortgageModal();
            }
        });

        // Also allow click to open (for touch devices)
        mortgageCalcTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            if (mortgageCalcModal.classList.contains('hidden')) {
                showMortgageModal();
            } else {
                hideMortgageModal();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMortgageModalOpen) {
                hideMortgageModal();
            }
        });
    }

    // Regular modal handling for other modals (excluding projectMenuModal and mortgageCalcModal)
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
        const modalId = trigger.getAttribute('data-modal-target');

        // Skip projectMenuModal and mortgageCalcModal as they're handled above
        if (modalId === '#projectMenuModal' || modalId === '#mortgageCalcModal') return;

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.querySelector(modalId);
            if (modal) {
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });

        // Close on close button click
        const closeButtons = modal.querySelectorAll('.data-close-modal, [data-close-modal]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            });
        });
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            });
        }
    });

    // ============================================
    // 2. LANGUAGE DROPDOWN
    // ============================================
    const langDropdownBtn = document.getElementById('current-selected-lang');
    const langDropdownList = document.getElementById('lang-dropdown-list');
    const selectedLangText = document.getElementById('selected-txt-lang');
    const langDropdownMenu = document.getElementById('lang-dropdown-menu');

    if (langDropdownBtn && langDropdownList && langDropdownMenu) {
        let hideTimeout;

        // Show dropdown on hover
        const showDropdown = () => {
            clearTimeout(hideTimeout);
            langDropdownList.classList.remove('hidden');
            const arrow = langDropdownBtn.querySelector('img');
            if (arrow) {
                arrow.style.transform = 'rotate(180deg)';
            }
        };

        // Hide dropdown with delay
        const hideDropdown = () => {
            hideTimeout = setTimeout(() => {
                langDropdownList.classList.add('hidden');
                const arrow = langDropdownBtn.querySelector('img');
                if (arrow) {
                    arrow.style.transform = 'rotate(0deg)';
                }
            }, 150);
        };

        // Hover on parent container (this covers both button and dropdown)
        langDropdownMenu.addEventListener('mouseenter', showDropdown);
        langDropdownMenu.addEventListener('mouseleave', hideDropdown);

        // Select language
        langDropdownList.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                if (selectedLangText) {
                    selectedLangText.textContent = item.textContent.trim();
                }
                langDropdownList.classList.add('hidden');
                const arrow = langDropdownBtn.querySelector('img');
                if (arrow) {
                    arrow.style.transform = 'rotate(0deg)';
                }
            });
        });
    }

    // ============================================
    // 3. MOBILE SIDEBAR (HAMBURGER MENU)
    // ============================================
    const btnHamburger = document.getElementById('btnHamburger');
    const containerSidebarMobile = document.getElementById('containerSidebarMobile');
    const bgSidebarMobile = document.getElementById('bgSidebarMobile');
    const sidebarMobile = document.getElementById('sidebarMobile');
    const imgHamburger = document.getElementById('imgHamburgerHeader');
    const imgCancel = document.getElementById('imgCancelHeader');

    if (btnHamburger && containerSidebarMobile) {
        let isSidebarOpen = false;

        btnHamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            isSidebarOpen = !isSidebarOpen;

            if (isSidebarOpen) {
                // Open sidebar
                containerSidebarMobile.classList.remove('hidden');
                document.body.style.overflow = 'hidden';

                setTimeout(() => {
                    if (bgSidebarMobile) bgSidebarMobile.style.opacity = '1';
                    if (sidebarMobile) {
                        sidebarMobile.style.height = 'calc(100vh - 83px)';
                        if (window.innerWidth >= 640) {
                            sidebarMobile.style.height = 'auto';
                        }
                    }
                }, 10);

                // Toggle icons
                if (imgHamburger) {
                    imgHamburger.style.opacity = '0';
                    imgHamburger.style.transform = 'scale(0)';
                }
                if (imgCancel) {
                    imgCancel.style.opacity = '1';
                    imgCancel.style.transform = 'scale(1)';
                }
            } else {
                // Close sidebar
                closeSidebar();
            }
        });

        // Close on background click
        if (bgSidebarMobile) {
            bgSidebarMobile.addEventListener('click', closeSidebar);
        }

        function closeSidebar() {
            isSidebarOpen = false;

            if (bgSidebarMobile) bgSidebarMobile.style.opacity = '0';
            if (sidebarMobile) sidebarMobile.style.height = '0';

            setTimeout(() => {
                containerSidebarMobile.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);

            // Toggle icons
            if (imgHamburger) {
                imgHamburger.style.opacity = '1';
                imgHamburger.style.transform = 'scale(1)';
            }
            if (imgCancel) {
                imgCancel.style.opacity = '0';
                imgCancel.style.transform = 'scale(0)';
            }
        }

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isSidebarOpen) {
                closeSidebar();
            }
        });
    }

    // ============================================
    // 4. MOBILE FILTER SIDEBAR
    // ============================================
    const btnOpenFilterSidebar = document.getElementById('btnOpenFilterSidebar');
    const containerFilterSidebarMobile = document.getElementById('containerFilterSidebarMobile');
    const bgFilterSidebarMobile = document.getElementById('bgFilterSidebarMobile');
    const filterSidebarMobile = document.getElementById('filterSidebarMobile');
    const btnCloseFilterSidebar = document.getElementById('btnCloseFilterSidebar');
    const btnApplyFilters = document.getElementById('btnApplyFilters');
    const btnResetFilters = document.getElementById('btnResetFilters');

    if (btnOpenFilterSidebar && containerFilterSidebarMobile) {
        let isFilterSidebarOpen = false;

        // Open filter sidebar
        btnOpenFilterSidebar.addEventListener('click', (e) => {
            e.stopPropagation();
            isFilterSidebarOpen = true;

            containerFilterSidebarMobile.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            setTimeout(() => {
                if (bgFilterSidebarMobile) bgFilterSidebarMobile.style.opacity = '1';
                if (filterSidebarMobile) {
                    filterSidebarMobile.style.height = '85vh';
                }
            }, 10);
        });

        // Close filter sidebar function
        function closeFilterSidebar() {
            isFilterSidebarOpen = false;

            if (bgFilterSidebarMobile) bgFilterSidebarMobile.style.opacity = '0';
            if (filterSidebarMobile) filterSidebarMobile.style.height = '0';

            setTimeout(() => {
                containerFilterSidebarMobile.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }

        // Close button
        if (btnCloseFilterSidebar) {
            btnCloseFilterSidebar.addEventListener('click', closeFilterSidebar);
        }

        // Close on background click
        if (bgFilterSidebarMobile) {
            bgFilterSidebarMobile.addEventListener('click', closeFilterSidebar);
        }

        // Apply filters button
        if (btnApplyFilters) {
            btnApplyFilters.addEventListener('click', () => {
                // Here you can add logic to apply filters
                console.log('Filters applied');
                closeFilterSidebar();
            });
        }

        // Reset filters button
        if (btnResetFilters) {
            btnResetFilters.addEventListener('click', () => {
                // Reset all checkboxes
                document.querySelectorAll('.filter-room-checkbox, .filter-delivery-checkbox, .filter-additional-checkbox').forEach(checkbox => {
                    checkbox.checked = false;
                });

                // Reset range slider
                const rangeSliders = filterSidebarMobile.querySelectorAll('.range-slider');
                rangeSliders.forEach(slider => {
                    const minThumb = slider.querySelector('.range-thumb-min');
                    const maxThumb = slider.querySelector('.range-thumb-max');
                    const fill = slider.querySelector('.range-fill');
                    const minPrice = slider.querySelector('.range-min');
                    const maxPrice = slider.querySelector('.range-max');

                    if (minThumb) minThumb.style.left = 'calc(0% - 8px)';
                    if (maxThumb) maxThumb.style.left = 'calc(100% - 8px)';
                    if (fill) {
                        fill.style.left = '0%';
                        fill.style.width = '100%';
                    }
                    if (minPrice) minPrice.textContent = '0';
                    if (maxPrice) maxPrice.textContent = '1000';
                });

                // Clear selected options
                updateSelectedOptions();
            });
        }

        // Update selected options display
        function updateSelectedOptions() {
            const selectedOptionsContainer = document.getElementById('selectedFilterOptions');
            if (!selectedOptionsContainer) return;

            selectedOptionsContainer.innerHTML = '';

            // Get all checked filters
            const checkedFilters = [];

            document.querySelectorAll('.filter-room-checkbox:checked').forEach(checkbox => {
                checkedFilters.push({ value: checkbox.dataset.value, label: `${checkbox.dataset.value} комнаты`, type: 'room' });
            });

            document.querySelectorAll('.filter-delivery-checkbox:checked').forEach(checkbox => {
                const label = checkbox.dataset.value === 'ready' ? 'Готовый дом' : '2025';
                checkedFilters.push({ value: checkbox.dataset.value, label: label, type: 'delivery' });
            });

            document.querySelectorAll('.filter-additional-checkbox:checked').forEach(checkbox => {
                const label = checkbox.dataset.value === 'mortgage' ? 'Только в ипотеку' : 'Только со скидками';
                checkedFilters.push({ value: checkbox.dataset.value, label: label, type: 'additional' });
            });

            // Create badge elements
            checkedFilters.forEach(filter => {
                const badge = document.createElement('div');
                badge.className = 'flex items-center gap-2 px-4 py-2 bg-main-black-5 rounded-full text-sm';
                badge.innerHTML = `
                    <span>${filter.label}</span>
                    <button class="remove-filter-option" data-type="${filter.type}" data-value="${filter.value}">
                        <img class="icon-sm" src="./assets/icons/cancel-dark.svg" alt="">
                    </button>
                `;
                selectedOptionsContainer.appendChild(badge);
            });

            // Add event listeners to remove buttons
            selectedOptionsContainer.querySelectorAll('.remove-filter-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    const type = btn.dataset.type;
                    const value = btn.dataset.value;

                    // Uncheck the corresponding checkbox
                    const checkbox = document.querySelector(`.filter-${type}-checkbox[data-value="${value}"]`);
                    if (checkbox) {
                        checkbox.checked = false;
                        updateSelectedOptions();
                    }
                });
            });
        }

        // Listen to checkbox changes
        document.querySelectorAll('.filter-room-checkbox, .filter-delivery-checkbox, .filter-additional-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectedOptions);
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isFilterSidebarOpen) {
                closeFilterSidebar();
            }
        });
    }

    // ============================================
    // 5. MOBILE CHAT BUTTONS
    // ============================================
    const btnAvailableChats = document.getElementById('btnAvailableChats');
    const containerForAvailableChats = document.getElementById('containerForAvailableChats');

    if (btnAvailableChats && containerForAvailableChats) {
        let isChatsOpen = false;

        btnAvailableChats.addEventListener('click', (e) => {
            e.stopPropagation();
            isChatsOpen = !isChatsOpen;

            if (isChatsOpen) {
                containerForAvailableChats.style.maxHeight = '300px';
                containerForAvailableChats.style.paddingBottom = '60px';
                containerForAvailableChats.style.transform = 'translateY(0)';
                containerForAvailableChats.style.opacity = '1';
            } else {
                containerForAvailableChats.style.maxHeight = '0';
                containerForAvailableChats.style.paddingBottom = '0';
                containerForAvailableChats.style.transform = 'translateY(12px)';
                containerForAvailableChats.style.opacity = '0';
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!btnAvailableChats.contains(e.target) && !containerForAvailableChats.contains(e.target)) {
                isChatsOpen = false;
                containerForAvailableChats.style.maxHeight = '0';
                containerForAvailableChats.style.paddingBottom = '0';
                containerForAvailableChats.style.transform = 'translateY(12px)';
                containerForAvailableChats.style.opacity = '0';
            }
        });
    }
});

// Open\Close Mini Modal
document.querySelectorAll('[data-mini-modal-trigger]').forEach(button => {
    const container = button.closest('.relative'); // контейнер кнопки
    if (!container) return;

    const modal = container.querySelector('.mini-modal');
    if (!modal) return;

    const triggerType = button.dataset.miniModalTrigger;

    if (triggerType === 'click') {
        button.addEventListener('click', e => {
            e.stopPropagation();
            modal.classList.toggle('hidden');
        });

        document.addEventListener('click', e => {
            if (!container.contains(e.target)) {
                modal.classList.add('hidden');
            }
        });

    } else if (triggerType === 'hover') {
        container.addEventListener('mouseenter', () => {
            modal.classList.remove('hidden');
        });
        container.addEventListener('mouseleave', () => {
            modal.classList.add('hidden');
        });
    }
});


//  Similiar Projects Additional Information 
document.querySelectorAll('.similar-project-container').forEach(container => {
    const button = container.querySelector('.additional-information-btn');
    const list = container.querySelector('.additional-information-container');
    let hideTimeout; // Store the timeout ID
    let isOpen = false; // Track state for mobile

    const showList = () => {
        list.style.maxHeight = list.scrollHeight + 'px';
        list.style.opacity = '1';
        list.style.pointerEvents = 'auto';
        list.classList.remove('my-0');
        list.classList.add('my-2');
        list.style.marginTop = '22px';
        list.style.marginBottom = '22px';
        isOpen = true;

        // Update button text on mobile
        if (window.innerWidth < 1024) {
            button.textContent = 'Скрыть';
        }
    };

    const hideList = () => {
        list.style.maxHeight = '0';
        list.style.opacity = '0';
        list.style.pointerEvents = 'none';
        list.classList.remove('my-2');
        list.classList.add('my-0');
        list.style.marginTop = '0px';
        list.style.marginBottom = '0px';
        isOpen = false;

        // Update button text on mobile
        if (window.innerWidth < 1024) {
            button.textContent = 'Раскрыть';
        }
    };

    // Button click handler - works on all screen sizes
    if (button) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (window.innerWidth < 1024) {
                // Mobile/tablet: toggle on click
                if (isOpen) {
                    hideList();
                } else {
                    showList();
                }
            }
        });
    }

    // Hover handlers for desktop only
    if (button) {
        button.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 1024) {
                clearTimeout(hideTimeout);
                showList();
            }
        });

        button.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 1024) {
                hideTimeout = setTimeout(hideList, 300);
            }
        });
    }

    if (list) {
        list.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 1024) {
                clearTimeout(hideTimeout);
                showList();
            }
        });

        list.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 1024) {
                hideTimeout = setTimeout(hideList, 300);
            }
        });
    }
});

// Slider for Similar Projects  
const swiperSimilarProjects = new Swiper(".similar-project-swiper", {
    slidesPerView: 1,
    spaceBetween: 2,
    loop: true,

    breakpoints: {
        640: {
            slidesPerView: 1,
            spaceBetween: 4,
            loop: true,

            pagination: {
                el: ".similar-project-pagination",
                clickable: true,
                renderBullet: function (index, className) {
                    // Тут можна повернути будь-яку HTML-розмітку
                    return `<span class="${className}" style="background-color: #FCFCFD1A; width:8px; height:8px; margin:0; border:none;"></span>`;
                },
            }
        }
    }
})

// Start Range Slider With Double Buttons
class RangeSlider {
    constructor(element, maxValue = 1000, minGap = 10) {
        this.container = element;
        this.maxValue = maxValue;
        this.minGap = minGap;

        this.track = this.container.querySelector('.range-track');
        this.fill = this.container.querySelector('.range-fill');
        this.minThumb = this.container.querySelector('.range-thumb-min');
        this.maxThumb = this.container.querySelector('.range-thumb-max');
        this.minPrice = this.container.querySelector('.range-min');
        this.maxPrice = this.container.querySelector('.range-max');

        this.minValue = 0;
        this.maxVal = maxValue;
        this.dragging = null;

        this.initEvents();
        this.updateUI();
    }

    updateUI() {
        const minPercent = (this.minValue / this.maxValue) * 100;
        const maxPercent = (this.maxVal / this.maxValue) * 100;

        this.minThumb.style.left = `calc(${minPercent}% - 8px)`;
        this.maxThumb.style.left = `calc(${maxPercent}% - 8px)`;
        this.fill.style.left = `${minPercent}%`;
        this.fill.style.width = `${maxPercent - minPercent}%`;

        this.minPrice.textContent = this.minValue.toLocaleString('ru-RU');
        this.maxPrice.textContent = this.maxVal.toLocaleString('ru-RU');
    }

    startDrag(e, thumb) {
        e.preventDefault();
        this.dragging = thumb;
    }

    stopDrag() {
        this.dragging = null;
    }

    onDrag(x) {
        if (!this.dragging) return;

        const rect = this.track.getBoundingClientRect();
        let percent = (x - rect.left) / rect.width;
        percent = Math.min(Math.max(percent, 0), 1);
        const value = Math.round(percent * this.maxValue);

        if (this.dragging === this.minThumb) {
            this.minValue = Math.min(value, this.maxVal - this.minGap);
        } else {
            this.maxVal = Math.max(value, this.minValue + this.minGap);
        }

        this.updateUI();
    }

    initEvents() {
        const start = (e, thumb) => {
            this.startDrag(e, thumb);
        };
        const move = e => {
            if (e.touches) {
                this.onDrag(e.touches[0].clientX);
            } else {
                this.onDrag(e.clientX);
            }
        };
        const end = () => this.stopDrag();

        [this.minThumb, this.maxThumb].forEach(thumb => {
            // desktop
            thumb.addEventListener('mousedown', e => start(e, thumb));
            // mobile
            thumb.addEventListener('touchstart', e => start(e, thumb), { passive: false });
        });

        // desktop move/end
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', end);

        // mobile move/end
        window.addEventListener('touchmove', move, { passive: false });
        window.addEventListener('touchend', end);
    }
}

document.querySelectorAll('.range-slider').forEach(sliderEl => {
    new RangeSlider(sliderEl);
});

//  End Slider With Double Buttons

// Start Reels

const swiper = new Swiper(".reels-swaper", {
    slidesPerView: 5.5,   // auto width based on slide
    spaceBetween: 16,        // gap between slides
    freeMode: true,
    grabCursor: true,
    scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
    },

    slidesOffsetBefore: 95, // відступ перед першим слайдом
    slidesOffsetAfter: 95,  // відступ після останнього слайду

});

// End Reels

// Start Hero Section
class ResponsiveCarousel {
    constructor() {
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.preloadedImages = new Map();

        this.slidesData = [
            {
                title: 'Respublika',
                subtitle: 'Житловий квартал',
                category: 'Комфорт клас',
                price: 'Квартиры от 13,5 млн ₸',
                location: 'Байтерек • 12 хв',
                imageUrl: './assets/images/RC/rc-1.png',
                bgColor: 'bg-blue-500'
            },
            {
                title: 'Almaty Towers',
                subtitle: 'Елітний комплекс',
                category: 'Преміум клас',
                price: 'Квартиры от 25 млн ₸',
                location: 'Центр • 5 хв',
                imageUrl: './assets/images/RC/rc-2.png',
                bgColor: 'bg-green-500'
            },
            {
                title: 'Green Valley',
                subtitle: 'Екологічне житло',
                category: 'Комфорт+',
                price: 'Квартиры от 18 млн ₸',
                location: 'Парк • 8 хв',
                imageUrl: './assets/images/RC/rc-3.jpg',
                bgColor: 'bg-red-500'
            },
            {
                title: 'Sky Residence',
                subtitle: 'Хмарочос',
                category: 'Люкс клас',
                price: 'Квартиры от 35 млн ₸',
                location: 'Бизнес центр • 3 хв',
                imageUrl: './assets/images/RC/rc-1.png',
                bgColor: 'bg-purple-500'
            },
            {
                title: 'River Park',
                subtitle: 'Житло біля річки',
                category: 'Комфорт клас',
                price: 'Квартиры от 16 млн ₸',
                location: 'Набережная • 10 хв',
                imageUrl: './assets/images/RC/rc-2.png',
                bgColor: 'bg-teal-500'
            },
            {
                title: 'Urban Center',
                subtitle: 'Міський квартал',
                category: 'Стандарт+',
                price: 'Квартиры от 20 млн ₸',
                location: 'Метро • 2 хв',
                imageUrl: './assets/images/RC/rc-3.jpg',
                bgColor: 'bg-orange-500'
            }
        ];

        this.init();
    }

    async init() {
        await this.preloadImages();
        this.createOuterSlides();
        this.createInnerSlides();
        this.createPagination();
        this.bindEvents();
        this.updateSlides();
    }

    async preloadImages() {
        // Only preload first 2 images for better performance
        const priorityImages = this.slidesData.slice(0, 2);
        const promises = priorityImages.map((slide, index) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    this.preloadedImages.set(index, img.src);
                    resolve();
                };
                img.onerror = () => {
                    this.preloadedImages.set(index, null);
                    resolve();
                };
                img.src = slide.imageUrl;
            });
        });
        await Promise.all(promises);

        // Lazy load remaining images
        this.slidesData.slice(2).forEach((slide, index) => {
            this.preloadedImages.set(index + 2, slide.imageUrl);
        });
    }

    createOuterSlides() {
        const container = document.getElementById('outerSlider');

        this.slidesData.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide-bg-img';
            slideElement.dataset.outerIndex = index;

            const imageUrl = this.preloadedImages.get(index);
            if (imageUrl) {
                slideElement.style.backgroundImage = `url(${imageUrl})`;
            } else {
                slideElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }

            slideElement.style.backgroundSize = 'cover';
            slideElement.style.backgroundPosition = 'center';
            slideElement.style.opacity = index === 0 ? '1' : '0';

            container.appendChild(slideElement);
        });
    }

    createInnerSlides() {
        const container = document.getElementById('innerSliderContainer');
        const totalSlides = this.slidesData.length;

        this.slidesData.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide';
            slideElement.dataset.innerIndex = index;

            slideElement.innerHTML = `
                <div class="relative w-full lg:w-auto p-ph rounded-[16px] bg-white border-4 border-white overflow-hidden shadow-[0_-1.72px_20.57px_0_rgba(12,12,13,0.4)]">
                    <div class="flex justify-between gap-1">
                        <div class="flex-none space-y-[10px] lg:space-y-[25px]">
                            <div>
                                <h2 class="text-xl font-bounded lg:text-[28px]">${slide.title}</h2>
                                <p class="flex items-center gap-1 text-2xs lg:text-base">
                                    <span>${slide.subtitle}</span>
                                    <span class="w-[2px] h-[2px] rounded-full bg-gray-400"></span>
                                    <span>${slide.category}</span>
                                </p>
                            </div>
                             <button class="btn-sm !w-auto px-4 lg:px-[42px]" data-btn-color="white">
                                    <span>Подробнее</span>
                            </button>
                        </div>
                        <div class="w-[100px] grow relative overflow-hidden -my-[14px] -mr-[14px] lg:-my-[25px] lg:-mr-[25px]">
                            <div class="absolute inset-y-0 right-0 translate-x-3 sm:translate-x-5 lg:translate-x-0 ">
                               
                                <svg class="w-full h-full scale-130 sm:scale-150 lg:scale-150" viewBox="0 0 74 74" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <clipPath id="octagon-clip-${index}">
                                                <!-- повертаємо фігуру -->
                                                <path d="M52.279,73.935H21.656L0,52.279V21.655L21.655,0h30.625l21.655,21.655v30.625L52.279,73.935z"
                                                      transform="rotate(18, 45, 45)"/>
                                            </clipPath>
                                        </defs>

                                        <image
                                                href="${slide.imageUrl}"
                                                width="100%" height="100%"
                                                preserveAspectRatio="xMidYMid slice"
                                                clip-path="url(#octagon-clip-${index})" />
                                    </svg>

                            </div>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(slideElement);
        });
    }

    createPagination() {
        const container = document.getElementById('pagination');

        this.slidesData.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'w-2 h-2 rounded-full cursor-pointer transition-all duration-300 hover:scale-110';
            dot.dataset.page = index;
            dot.style.pointerEvents = 'auto'; // Переконуємось що клік працює
            container.appendChild(dot);
        });
    }

    updateSlides() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;

        // Зберігаємо попередній індекс для анімації
        this.prevCurrentIndex = this.prevCurrentIndex !== undefined ? this.currentIndex : this.currentIndex;

        this.updateOuterSlides();
        this.updateInnerSlides();
        this.updatePagination();
        this.updateContent();

        setTimeout(() => {
            this.isTransitioning = false;
            this.prevCurrentIndex = this.currentIndex;
        }, 650); // Збільшено час для більш плавної анімації
    }

    updateOuterSlides() {
        const slides = document.querySelectorAll('[data-outer-index]');
        slides.forEach((slide, index) => {
            slide.style.opacity = index === this.currentIndex ? '1' : '0';
        });
    }

    updateInnerSlides() {
        const slides = document.querySelectorAll('[data-inner-index]');
        const isMobile = window.innerWidth < 640;
        const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
        const isDesktop = window.innerWidth >= 1024;
        const total = slides.length;
        const container = document.getElementById('innerSliderContainer');

        slides.forEach((slide, index) => {
            const isCurrent = index === this.currentIndex;
            const isNext = index === (this.currentIndex + 1) % total;
            const isPrev = index === (this.currentIndex - 1 + total) % total;

            // Mobile: 2 слайди (поточний + наступний праворуч ~20%), розтягнуто по ширині
            if (isMobile) {
                if (container) {
                    container.style.justifyContent = 'flex-center';
                    container.style.paddingRight = '0px'; // Відступ справа
                    // CHANGE: Added to reset padding-left for consistency on resize
                    container.style.paddingLeft = '0px';
                }

                if (isCurrent) {
                    slide.style.cssText = `
                        position: relative;
                        z-index: 30;
                        transform: scale(1) translateX(0);
                        opacity: 1;
                        display: block;
                        width: calc(100% - 16px);
                        flex-shrink: 0;
                        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    `;
                } else if (isNext) {
                    // Показуємо ~20% наступної картки з правого боку
                    const visiblePart = 0.91; // 20% видимої частини
                    slide.style.cssText = `
                        position: absolute;
                        left: calc(100% - ${visiblePart * 100}%);
                        top: 0;
                        z-index: 20;
                        transform: scale(0.9);
                        opacity: 0.8;
                        display: block;
                        width: calc(100% - 16px);
                        flex-shrink: 0;
                        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    `;
                } else {
                    slide.style.cssText = `
                        position: absolute;
                        left: 20%;
                        top: 0;
                        z-index: 10;
                        transform: scale(0.8);
                        opacity: 0;
                        display: none;
                        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    `;
                }
            }
            // Tablet: 3 слайди з анімацією (попередній затемнений + поточний + наступний ~20% позаду)
            else if (isTablet) {
                if (container) {
                    // CHANGE: Fixed typo from 'flex-center' to 'center' for proper justification
                    container.style.justifyContent = 'center';
                    container.style.paddingLeft = '16px'; // Відступ зліва
                    container.style.paddingRight = '50px'; // Відступ справа
                }

                if (isPrev) {
                    // Попередній слайд - затемнений, повний розмір зліва
                    slide.style.cssText = `
                        position: relative;
                        z-index: 20;
                        transform: scale(1) translateX(0);
                        opacity: 0.6;
                        display: block;
                        width: 50%;
                        flex-shrink: 0;
                        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                        filter: brightness(0.8);
                        order: -1; /* CHANGE: Added to ensure prev is always visually left of current regardless of DOM order */
                    `;
                } else if (isCurrent) {
                    // Поточний слайд - повний розмір по центру
                    slide.style.cssText = `
                        position: relative;
                        z-index: 30;
                        transform: scale(1) translateX(0);
                        opacity: 1;
                        display: block;
                        width: 50%;
                        flex-shrink: 0;
                        margin-left: 16px;
                        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                        filter: brightness(1);
                        order: 0; /* CHANGE: Added to ensure current is always visually right of prev */
                    `;
                } else if (isNext) {
                    // Наступний слайд - ~20% видимий позаду поточного
                    const visiblePart = 0.44; // 20% видимої частини
                    slide.style.cssText = `
                        position: absolute;
                        left: calc(100% * ${1 - visiblePart});
                        top: 0;
                        z-index: 20;
                        transform: scale(0.8);
                        opacity: 0.8;
                        display: block;
                        width: 50%;
                        flex-shrink: 0;
                        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    `;
                } else {
                    slide.style.cssText = `
                        position: absolute;
                        left: ${index < this.currentIndex ? '-400px' : '1200px'};
                        top: 0;
                        z-index: 10;
                        opacity: 0;
                        display: none;
                        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    `;
                }
            }
            // Desktop: 2 слайди (поточний + наступний зверху) з покращеною анімацією
            else if (isDesktop) {
                if (container) {
                    container.style.justifyContent = 'flex-start';
                    container.style.overflow = 'visible';
                    // CHANGE: Added to reset paddings on resize from tablet to prevent shifting
                    container.style.paddingLeft = '0px';
                    container.style.paddingRight = '0px';
                }

                const direction = this.getAnimationDirection(index);

                if (isCurrent) {
                    slide.style.cssText = `
                        position: relative;
                        z-index: 30;
                        transform: scale(1) translateY(0);
                        opacity: 1;
                        display: block;
                        width: clamp(450px, 40vw, 566px);
                        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    `;
                } else if (isNext) {
                    slide.style.cssText = `
                        position: absolute;
                        left: 0;
                        top: 0;
                        z-index: 20;
                        transform: scale(0.8) translateY(-60px);
                        opacity: 0.8;
                        display: block;
                        width: clamp(450px, 40vw, 566px);
                        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    `;
                } else {
                    slide.style.cssText = `
                        position: absolute;
                        left: 0;
                        top: 0;
                        z-index: 10;
                        transform: scale(0.88) translateY(-48px);
                        opacity: 0;
                        display: none;
                        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    `;
                }
            }
        });
    }

    getAnimationDirection(slideIndex) {
        // Визначаємо напрямок анімації для desktop
        const prevIndex = this.prevCurrentIndex !== undefined ? this.prevCurrentIndex : this.currentIndex;

        if (slideIndex < this.currentIndex || (slideIndex === this.slidesData.length - 1 && this.currentIndex === 0)) {
            return 'up'; // Слайд йде вгору (вже був показаний)
        } else {
            return 'down'; // Слайд йде вниз (буде показаний)
        }
    }

    updatePagination() {
        const dots = document.querySelectorAll('[data-page]');
        dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.className = 'w-2 h-2 rounded-full cursor-pointer transition-all duration-300 bg-white shadow-lg';
            } else {
                dot.className = 'w-2 h-2 rounded-full cursor-pointer transition-all duration-300 bg-white/20';
            }
        });
    }

    updateContent() {
        const slide = this.slidesData[this.currentIndex];
        const title = document.getElementById('mainTitle');
        const badges = document.getElementById('badgesContainer');

        if (title) {
            title.style.opacity = '0';
            setTimeout(() => {
                title.textContent = slide.title;
                title.style.opacity = '1';
            }, 300);
        }

        if (badges) {
            badges.style.opacity = '0';
            setTimeout(() => {
                badges.innerHTML = `
                     <div class="relative rounded-full bg-[#00000003] p-[1px]
                            before:content-[''] before:z-1 before:absolute before:inset-0 before:rounded-full before:bg-linear-171 before:from-[#FFFFFF1A] before:to-[#FFFFFF00]">
                        <div class="relative z-2 backdrop-blur-[100px] bg-[#00000003] text-white text-sm font-semibold px-4 py-2 rounded-full">
                            <span>${slide.location}</span>
                        </div>
                    </div>
                    <div class="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-full">
                        <span>${slide.price}</span>
                    </div>
                   
                `;
                badges.style.opacity = '1';
            }, 300);
        }
    }

    next() {
        if (this.isTransitioning) return;
        console.log('Next - current:', this.currentIndex);
        this.currentIndex = (this.currentIndex + 1) % this.slidesData.length;
        console.log('Next - new:', this.currentIndex);
        this.updateSlides();
    }

    prev() {
        if (this.isTransitioning) return;
        console.log('Prev - current:', this.currentIndex);
        this.currentIndex = (this.currentIndex - 1 + this.slidesData.length) % this.slidesData.length;
        console.log('Prev - new:', this.currentIndex);
        this.updateSlides();
    }

    goToSlide(index) {
        if (this.isTransitioning) return;
        console.log('GoToSlide:', index);

        const targetIndex = parseInt(index);

        // Просто переходимо до потрібного слайда без проміжних анімацій
        this.currentIndex = targetIndex;
        this.updateSlides();
    }


    bindEvents() {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtnMobile = document.getElementById('nextBtnMobile');
        const prevBtnMobile = document.getElementById('prevBtnMobile');
        const pagination = document.getElementById('pagination');

        // Desktop кнопки - перевіряємо що це саме кнопки
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Next clicked');
                this.prev(); // Arrow up (rotated 180deg) = previous slide
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Prev clicked');
                this.next(); // Arrow down = next slide
            });
        }

        // Mobile кнопки
        if (nextBtnMobile) {
            nextBtnMobile.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.next();
            });
        }
        if (prevBtnMobile) {
            prevBtnMobile.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.prev();
            });
        }

        // Пагінація - краща обробка кліків
        if (pagination) {
            pagination.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Шукаємо найближчий елемент з data-page
                const target = e.target.closest('[data-page]');
                if (target && target.dataset.page !== undefined) {
                    console.log('Pagination clicked:', target.dataset.page);
                    this.goToSlide(target.dataset.page);
                }
            });

            // Додаткова обробка для кожної точки окремо
            const dots = pagination.querySelectorAll('[data-page]');
            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Dot clicked:', dot.dataset.page);
                    this.goToSlide(dot.dataset.page);
                });
            });
        }

        // Клавіатурна навігація
        document.addEventListener('keydown', (e) => {
            if (this.isTransitioning) return;

            switch (e.key) {
                case 'ArrowUp':
                case 'ArrowRight':
                    e.preventDefault();
                    this.next();
                    break;
                case 'ArrowDown':
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prev();
                    break;
            }
        });

        // Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        }, { passive: true });

        // Resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.updateSlides();
            }, 150);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ResponsiveCarousel();
});


// End Hero Section 
// ============================================
// QUIZ MODAL FUNCTIONALITY
// ============================================

class QuizModal {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.answers = {};

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const modal = document.getElementById('quizModal');
        if (!modal) return;

        // Handle option button clicks
        modal.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const step = e.target.closest('.quiz-step');
                const stepNumber = step.dataset.step;

                // Remove selected class from siblings
                step.querySelectorAll('.quiz-option-btn').forEach(b => {
                    b.classList.remove('selected');
                });

                // Add selected class to clicked button
                e.target.classList.add('selected');

                // Store answer
                this.answers[`step${stepNumber}`] = e.target.dataset.value;

                // Enable next/submit button
                const nextBtn = step.querySelector('.quiz-next-btn, .quiz-submit-btn');
                if (nextBtn) {
                    nextBtn.disabled = false;

                    // Only make button green on last step (step 3)
                    if (stepNumber === '3') {
                        nextBtn.setAttribute('data-btn-color', 'green');
                        nextBtn.classList.remove('border-border-line-white', 'bg-white', 'fill-main-black-100', 'text-main-black-100');
                        nextBtn.classList.add('bg-linear-180');
                    }
                }
            });
        });

        // Handle next button clicks
        modal.querySelectorAll('.quiz-next-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.nextStep();
            });
        });

        // Handle skip button clicks
        modal.querySelectorAll('.quiz-skip-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.nextStep();
            });
        });

        // Handle submit button click
        const submitBtn = modal.querySelector('.quiz-submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitQuiz();
            });
        }

        // Reset quiz when modal opens
        document.querySelectorAll('[data-modal-target="#quizModal"]').forEach(trigger => {
            trigger.addEventListener('click', () => {
                this.resetQuiz();
            });
        });

        // Reset quiz when modal closes
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('.data-close-modal')) {
                this.resetQuiz();
            }
        });
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            // Hide current step
            const currentStepEl = document.querySelector(`.quiz-step[data-step="${this.currentStep}"]`);
            if (currentStepEl) {
                currentStepEl.classList.remove('active');
            }

            // Show next step
            this.currentStep++;
            const nextStepEl = document.querySelector(`.quiz-step[data-step="${this.currentStep}"]`);
            if (nextStepEl) {
                nextStepEl.classList.add('active');
            }
        }
    }

    submitQuiz() {
        console.log('Quiz submitted with answers:', this.answers);

        // Here you can add logic to:
        // 1. Send data to server
        // 2. Filter apartments based on answers
        // 3. Redirect to results page
        // 4. Show results in modal

        // For now, just close the modal
        const modal = document.getElementById('quizModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }

        // Show success message (optional)
        alert('Спасибо! Показываем подходящие квартиры...');

        this.resetQuiz();
    }

    resetQuiz() {
        this.currentStep = 1;
        this.answers = {};

        // Hide all steps
        document.querySelectorAll('.quiz-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show first step
        const firstStep = document.querySelector('.quiz-step[data-step="1"]');
        if (firstStep) {
            firstStep.classList.add('active');
        }

        // Reset all selections
        document.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Disable all next/submit buttons
        document.querySelectorAll('.quiz-next-btn, .quiz-submit-btn').forEach(btn => {
            btn.disabled = true;
        });
    }
}

// Initialize quiz modal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new QuizModal();
});

// ============================================
// PROJECTS/FLATS SWITCH FUNCTIONALITY
// ============================================

class ProjectsFlatsSwitch {
    constructor() {
        this.projectsContainer = document.getElementById('projects');
        this.flatsContainer = document.getElementById('flats');
        this.titleElement = document.getElementById('projects-flats-title');
        this.currentView = 'projects';

        this.init();
    }

    init() {
        // Set initial state for projects (visible)
        if (this.projectsContainer) {
            this.projectsContainer.style.position = 'relative';
            this.projectsContainer.style.opacity = '1';
            this.projectsContainer.style.transform = 'translateY(0)';
            this.projectsContainer.style.pointerEvents = 'auto';
        }

        // Set initial state for flats (hidden)
        if (this.flatsContainer) {
            this.flatsContainer.style.position = 'absolute';
            this.flatsContainer.style.opacity = '0';
            this.flatsContainer.style.transform = 'translateY(-20px)';
            this.flatsContainer.style.pointerEvents = 'none';
            this.flatsContainer.style.top = '0';
            this.flatsContainer.style.left = '0';
            this.flatsContainer.style.width = '100%';
        }

        this.bindTabButtons();
    }

    bindTabButtons() {
        // Find the tab container in the main-container section
        const tabContainer = document.querySelector('.main-container [x-data*="tabSelected"]');
        if (!tabContainer) return;

        const tabButtons = tabContainer.querySelectorAll('button[\\:id]');

        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // index 0 = Проекты, index 1 = Квартиры
                if (index === 0) {
                    this.showProjects();
                } else if (index === 1) {
                    this.showFlats();
                }
            });
        });
    }

    showProjects() {
        if (this.currentView === 'projects' || !this.flatsContainer || !this.projectsContainer) return;

        this.currentView = 'projects';

        // Change title
        if (this.titleElement) {
            this.titleElement.textContent = 'Наши проекты в Астане';
        }

        // Fade out flats
        this.flatsContainer.style.opacity = '0';
        this.flatsContainer.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            // Hide flats completely
            this.flatsContainer.style.position = 'absolute';
            this.flatsContainer.style.pointerEvents = 'none';

            // Show projects
            this.projectsContainer.style.position = 'relative';
            this.projectsContainer.style.pointerEvents = 'auto';

            // Fade in projects
            requestAnimationFrame(() => {
                this.projectsContainer.style.opacity = '1';
                this.projectsContainer.style.transform = 'translateY(0)';
            });
        }, 400);
    }

    showFlats() {
        if (this.currentView === 'flats' || !this.flatsContainer || !this.projectsContainer) return;

        this.currentView = 'flats';

        // Change title
        if (this.titleElement) {
            this.titleElement.textContent = 'Наши квартиры в Астане';
        }

        // Fade out projects
        this.projectsContainer.style.opacity = '0';
        this.projectsContainer.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            // Hide projects completely
            this.projectsContainer.style.position = 'absolute';
            this.projectsContainer.style.pointerEvents = 'none';

            // Show flats
            this.flatsContainer.style.position = 'relative';
            this.flatsContainer.style.pointerEvents = 'auto';

            // Fade in flats
            requestAnimationFrame(() => {
                this.flatsContainer.style.opacity = '1';
                this.flatsContainer.style.transform = 'translateY(0)';
            });
        }, 400);
    }
}

// Initialize switch functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsFlatsSwitch();
});


// Flat Cards Swiper
document.addEventListener('DOMContentLoaded', () => {
    const flatSwipers = document.querySelectorAll('.flat-swiper');

    flatSwipers.forEach((swiperEl) => {
        new Swiper(swiperEl, {
            slidesPerView: 1,
            spaceBetween: 0,
            pagination: {
                el: swiperEl.querySelector('.flat-pagination'),
                clickable: true,
            },
        });
    });
});


// Respublika / Park City Tab Switching
class ResidentialComplexSwitch {
    constructor() {
        this.respublikaContainer = document.getElementById('respublika-content');
        this.parkCityContainer = document.getElementById('parkcity-content');
        this.currentView = 'respublika';

        this.init();
    }

    init() {
        // Set initial state for respublika (visible)
        if (this.respublikaContainer) {
            this.respublikaContainer.style.position = 'relative';
            this.respublikaContainer.style.opacity = '1';
            this.respublikaContainer.style.transform = 'translateY(0)';
            this.respublikaContainer.style.pointerEvents = 'auto';
        }

        // Set initial state for park city (hidden)
        if (this.parkCityContainer) {
            this.parkCityContainer.style.position = 'absolute';
            this.parkCityContainer.style.opacity = '0';
            this.parkCityContainer.style.transform = 'translateY(-20px)';
            this.parkCityContainer.style.pointerEvents = 'none';
            this.parkCityContainer.style.top = '0';
            this.parkCityContainer.style.left = '0';
            this.parkCityContainer.style.width = '100%';
        }

        this.bindTabButtons();
    }

    bindTabButtons() {
        // Find the second main-container section with tabs
        const sections = document.querySelectorAll('.main-container');
        if (sections.length < 2) return;

        const tabContainer = sections[1].querySelector('[x-data*="tabSelected"]');
        if (!tabContainer) return;

        const tabButtons = tabContainer.querySelectorAll('button[\\:id]');

        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // index 0 = Respublika, index 1 = Park City
                if (index === 0) {
                    this.showRespublika();
                } else if (index === 1) {
                    this.showParkCity();
                }
            });
        });
    }

    showRespublika() {
        if (this.currentView === 'respublika' || !this.parkCityContainer || !this.respublikaContainer) return;

        this.currentView = 'respublika';

        // Fade out park city
        this.parkCityContainer.style.opacity = '0';
        this.parkCityContainer.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            // Hide park city completely
            this.parkCityContainer.style.position = 'absolute';
            this.parkCityContainer.style.pointerEvents = 'none';

            // Show respublika
            this.respublikaContainer.style.position = 'relative';
            this.respublikaContainer.style.pointerEvents = 'auto';

            // Fade in respublika
            requestAnimationFrame(() => {
                this.respublikaContainer.style.opacity = '1';
                this.respublikaContainer.style.transform = 'translateY(0)';
            });
        }, 400);
    }

    showParkCity() {
        if (this.currentView === 'parkcity' || !this.parkCityContainer || !this.respublikaContainer) return;

        this.currentView = 'parkcity';

        // Fade out respublika
        this.respublikaContainer.style.opacity = '0';
        this.respublikaContainer.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            // Hide respublika completely
            this.respublikaContainer.style.position = 'absolute';
            this.respublikaContainer.style.pointerEvents = 'none';

            // Show park city
            this.parkCityContainer.style.position = 'relative';
            this.parkCityContainer.style.pointerEvents = 'auto';

            // Fade in park city
            requestAnimationFrame(() => {
                this.parkCityContainer.style.opacity = '1';
                this.parkCityContainer.style.transform = 'translateY(0)';
            });
        }, 400);
    }
}

// Initialize residential complex switch functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ResidentialComplexSwitch();
});

// ============================================
// REELS MODAL FUNCTIONALITY
// ============================================

class ReelsModal {
    constructor() {
        this.modal = document.getElementById('reelsModal');
        this.video = document.getElementById('reelsVideo');
        this.playPauseOverlay = document.getElementById('reelsPlayPause');
        this.playIcon = document.getElementById('reelsPlayIcon');
        this.progressBar = document.getElementById('reelsProgress');
        this.prevBtn = document.getElementById('reelsPrevBtn');
        this.nextBtn = document.getElementById('reelsNextBtn');

        this.currentIndex = 0;
        this.isPlaying = false;
        this.hideControlsTimeout = null;

        // Video sources - add your video files here
        this.videos = [
            './assets/videos/reel-1.mp4',
            './assets/videos/reel-2.mp4',
            './assets/videos/reel-3.mp4',
            './assets/videos/reel-4.mp4',
            './assets/videos/reel-5.mp4',
            './assets/videos/reel-6.mp4'
        ];

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Open modal when clicking on reel slides
        document.querySelectorAll('[data-reel-index]').forEach(slide => {
            slide.addEventListener('click', (e) => {
                const index = parseInt(slide.dataset.reelIndex);
                this.openModal(index);
            });
        });

        // Close modal
        this.modal.querySelectorAll('.data-close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // Close on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });

        // Play/Pause on video click
        this.video.addEventListener('click', () => {
            this.togglePlayPause();
        });

        // Update progress bar
        this.video.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        // Auto play next video when current ends
        this.video.addEventListener('ended', () => {
            this.nextVideo();
        });

        // Navigation buttons
        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.prevVideo();
        });

        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.nextVideo();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('hidden')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevVideo();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextVideo();
                } else if (e.key === ' ') {
                    e.preventDefault();
                    this.togglePlayPause();
                }
            }
        });

        // Show/hide controls on mouse move
        this.modal.addEventListener('mousemove', () => {
            this.showControls();
        });

        // Touch support for mobile
        let touchStartY = 0;
        let touchEndY = 0;

        this.video.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        this.video.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            const diff = touchStartY - touchEndY;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextVideo();
                } else {
                    this.prevVideo();
                }
            }
        }, { passive: true });
    }

    openModal(index) {
        this.currentIndex = index;
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        this.loadVideo(index);
        this.showControls();
    }

    closeModal() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
        this.video.pause();
        this.isPlaying = false;
        this.video.currentTime = 0;
    }

    loadVideo(index) {
        const videoSrc = this.videos[index];
        this.video.querySelector('source').src = videoSrc;
        this.video.load();
        this.video.play().then(() => {
            this.isPlaying = true;
            this.updatePlayIcon();
        }).catch(err => {
            console.error('Error playing video:', err);
        });
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.video.pause();
            this.isPlaying = false;
        } else {
            this.video.play();
            this.isPlaying = true;
        }
        this.updatePlayIcon();
        this.showPlayPauseOverlay();
    }

    updatePlayIcon() {
        if (this.isPlaying) {
            this.playIcon.src = './assets/icons/puase-white.svg';
        } else {
            this.playIcon.src = './assets/icons/puase-white.svg'; // You might want a play icon here
        }
    }

    showPlayPauseOverlay() {
        this.playPauseOverlay.style.opacity = '1';
        setTimeout(() => {
            this.playPauseOverlay.style.opacity = '0';
        }, 500);
    }

    updateProgress() {
        const progress = (this.video.currentTime / this.video.duration) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    nextVideo() {
        this.currentIndex = (this.currentIndex + 1) % this.videos.length;
        this.loadVideo(this.currentIndex);
    }

    prevVideo() {
        this.currentIndex = (this.currentIndex - 1 + this.videos.length) % this.videos.length;
        this.loadVideo(this.currentIndex);
    }

    showControls() {
        this.prevBtn.style.opacity = '1';
        this.nextBtn.style.opacity = '1';

        clearTimeout(this.hideControlsTimeout);
        this.hideControlsTimeout = setTimeout(() => {
            if (this.isPlaying) {
                this.prevBtn.style.opacity = '0';
                this.nextBtn.style.opacity = '0';
            }
        }, 2000);
    }
}

// Initialize reels modal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ReelsModal();
});

document.addEventListener('DOMContentLoaded', function () {
    // Get all language buttons
    const langButtons = document.querySelectorAll('[data-lang]');

    langButtons.forEach(button => {
        button.addEventListener('click', function () {
            const selectedLang = this.getAttribute('data-lang');

            // Remove active styles from all buttons
            langButtons.forEach(btn => {
                btn.classList.remove('bg-primary', 'text-main-green');
                btn.classList.add('ring', 'ring-border-line-white', 'bg-main-black-5');
            });

            // Add active styles to clicked button
            this.classList.remove('ring', 'ring-border-line-white', 'bg-main-black-5');
            this.classList.add('bg-primary', 'text-main-green');

            // Optional: Store selected language in localStorage
            localStorage.setItem('selectedLanguage', selectedLang);

            // Optional: You can add language switching logic here
            console.log('Language switched to:', selectedLang);
        });
    });

    // Optional: Restore previously selected language on page load
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
        const savedButton = document.querySelector(`[data-lang="${savedLang}"]`);
        if (savedButton) {
            savedButton.click();
        }
    }
});

// Prevent letters in all tel inputs
document.addEventListener('DOMContentLoaded', function () {
    const telInputs = document.querySelectorAll('input[type="tel"]');

    telInputs.forEach(input => {
        // Prevent typing letters
        input.addEventListener('keypress', function (e) {
            // Allow only numbers, +, -, (, ), and space
            const allowedChars = /[0-9+\-() ]/;
            const key = String.fromCharCode(e.which || e.keyCode);

            if (!allowedChars.test(key)) {
                e.preventDefault();
                return false;
            }
        });

        // Remove any letters that might be pasted
        input.addEventListener('input', function (e) {
            // Remove all letters (any language)
            this.value = this.value.replace(/[^\d+\-() ]/g, '');
        });

        // Also handle paste event
        input.addEventListener('paste', function (e) {
            setTimeout(() => {
                this.value = this.value.replace(/[^\d+\-() ]/g, '');
            }, 0);
        });
    });
});

// Lazy loading handler
document.addEventListener('DOMContentLoaded', function () {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    lazyImages.forEach(img => {
        // Add placeholder class initially
        img.classList.add('img-placeholder');

        // When image loads, remove placeholder and fade in
        img.addEventListener('load', function () {
            this.classList.remove('img-placeholder');
            this.classList.add('loaded');
        });

        // Handle error case
        img.addEventListener('error', function () {
            this.classList.remove('img-placeholder');
            console.warn('Failed to load image:', this.src);
        });
    });
});


// ============================================
// MOBILE PROJECT INFO TOGGLE FUNCTIONALITY
// ============================================

class MobileProjectInfoToggle {
    constructor() {
        this.cards = document.querySelectorAll('.mobile-project-info-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            const toggleBtn = card.querySelector('.mobile-info-toggle-btn');
            const infoContainer = card.querySelector('.mobile-additional-info');

            if (toggleBtn && infoContainer) {
                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleInfo(toggleBtn, infoContainer);
                });
            }
        });
    }

    toggleInfo(button, container) {
        const isExpanded = container.style.maxHeight && container.style.maxHeight !== '0px';

        if (isExpanded) {
            // Collapse
            container.style.maxHeight = '0';
            container.style.opacity = '0';
            container.style.padding = '0';
            button.textContent = 'Раскрыть';
        } else {
            // Expand
            const contentHeight = container.scrollHeight;
            container.style.maxHeight = contentHeight + 'px';
            container.style.opacity = '1';
            container.style.padding = '';
            button.textContent = 'Скрыть';
        }
    }
}

// Initialize mobile project info toggle when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MobileProjectInfoToggle();
});

// ============================================
// BACKEND DATA SIMULATION & RENDERING
// ============================================

class ProjectsDataManager {
    constructor() {
        // Simulated backend data
        this.originalProjectsData = [
            {
                id: 1,
                name: 'Respublica',
                address: 'ул. Сыганак, 24',
                landmark: 'Хан Шатыр',
                travelTime: '7 мин',
                minPrice: 15.5,
                images: [
                    './assets/images/RC/rc-2.png',
                    './assets/images/RC/rc-2.png',
                    './assets/images/RC/rc-2.png'
                ],
                badges: [
                    { text: 'Выгода до 9%', type: 'for-sale-rev', icon: './assets/icons/lighting-red.svg' },
                    { text: 'Комфорт класс', type: 'full-blur' },
                    { text: 'Есть готовые очереди', type: 'full-blur' },
                    { text: 'Развиваем район', type: 'full-blur' }
                ],
                banks: [
                    { name: 'Holy банк', logo: './assets/images/Banks/bank-1.png' },
                    { name: 'Freedom банк', logo: './assets/images/Banks/bank-2.png' }
                ],
                apartments: [
                    { rooms: 1, price: 13.5 },
                    { rooms: 2, price: 23.5 },
                    { rooms: 3, price: 33.5 },
                    { rooms: 4, price: 43.5 }
                ],
                features: [
                    { icon: './assets/icons/location-dark.svg', text: 'Живописный пруд и тишина окружения' },
                    { icon: './assets/icons/build-dark.svg', text: 'Формирование новой городской среды с акцентом на комфорт' }
                ],
                isLarge: true
            },
            {
                id: 2,
                name: 'Eleven',
                address: 'ул. Култегин 4а',
                landmark: 'Хан Шатыр',
                travelTime: '8 мин',
                minPrice: 15.5,
                images: [
                    './assets/images/RC/rc-3.jpg',
                    './assets/images/RC/rc-3.jpg',
                    './assets/images/RC/rc-3.jpg'
                ],
                badges: [
                    { text: 'Комфорт класс', type: 'full-blur' },
                    { text: 'Готовый дом', type: 'full-blur' }
                ],
                banks: [
                    { name: 'Holy банк', logo: './assets/images/Banks/bank-1.png' },
                    { name: 'Freedom банк', logo: './assets/images/Banks/bank-2.png' }
                ],
                apartments: [
                    { rooms: 1, price: 13.5 },
                    { rooms: 2, price: 23.5 },
                    { rooms: 3, price: 33.5 },
                    { rooms: 4, price: 43.5 }
                ],
                isLarge: false
            },
            {
                id: 3,
                name: 'Four Seasons',
                address: 'прю Туран, 39а',
                landmark: 'Хан Шатыр',
                travelTime: '1 мин',
                minPrice: 15.5,
                images: [
                    './assets/images/RC/rc-5.jpg',
                    './assets/images/RC/rc-5.jpg',
                    './assets/images/RC/rc-5.jpg'
                ],
                badges: [
                    { text: 'Бизнес класс', type: 'full-blur', customClass: 'business-class-badge' },
                    { text: 'Готовый дом', type: 'full-blur' }
                ],
                banks: [
                    { name: 'Holy банк', logo: './assets/images/Banks/bank-1.png' },
                    { name: 'Freedom банк', logo: './assets/images/Banks/bank-2.png' }
                ],
                apartments: [
                    { rooms: 1, price: 13.5 },
                    { rooms: 2, price: 23.5 },
                    { rooms: 3, price: 33.5 },
                    { rooms: 4, price: 43.5 }
                ],
                isLarge: false
            },
            {
                id: 4,
                name: 'Delta',
                address: 'ул. Жубан Молдагалиева 1',
                landmark: 'Хан Шатыр',
                travelTime: '10 мин',
                minPrice: 15.5,
                images: [
                    './assets/images/RC/rc-4.jpg',
                    './assets/images/RC/rc-4.jpg',
                    './assets/images/RC/rc-4.jpg'
                ],
                badges: [
                    { text: 'Комфорт класс', type: 'full-blur' },
                    { text: 'Готовый дом', type: 'full-blur' }
                ],
                banks: [
                    { name: 'Holy банк', logo: './assets/images/Banks/bank-1.png' },
                    { name: 'Freedom банк', logo: './assets/images/Banks/bank-2.png' }
                ],
                apartments: [
                    { rooms: 1, price: 13.5 },
                    { rooms: 2, price: 23.5 },
                    { rooms: 3, price: 33.5 },
                    { rooms: 4, price: 43.5 }
                ],
                isLarge: false
            },
            {
                id: 5,
                name: 'Park City',
                address: 'ул. Сыганак',
                landmark: 'Хан Шатыр',
                travelTime: '10 мин',
                minPrice: 15.5,
                images: [
                    './assets/images/RC/rc-3.jpg',
                    './assets/images/RC/rc-3.jpg',
                    './assets/images/RC/rc-3.jpg'
                ],
                badges: [
                    { text: 'Комфорт класс', type: 'full-blur' },
                    { text: 'Есть готовые очереди', type: 'full-blur' },
                    { text: 'Развиваем район', type: 'full-blur' }
                ],
                banks: [
                    { name: 'Holy банк', logo: './assets/images/Banks/bank-1.png' },
                    { name: 'Freedom банк', logo: './assets/images/Banks/bank-2.png' }
                ],
                apartments: [
                    { rooms: 1, price: 13.5 },
                    { rooms: 2, price: 23.5 },
                    { rooms: 3, price: 33.5 },
                    { rooms: 4, price: 43.5 }
                ],
                isLarge: false
            }
        ];

        this.projectsData = JSON.parse(JSON.stringify(this.originalProjectsData));
        this.init();
    }

    init() {
        // Simulate API call delay
        setTimeout(() => {
            this.renderProjects();
        }, 100);
    }

    // Simulate API call
    async fetchProjects() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.projectsData);
            }, 500);
        });
    }

    renderProjects() {
        const container = document.querySelector('#projects .grid');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Check if there are no projects
        if (this.projectsData.length === 0) {
            this.showNoResultsProjects(container);
            return;
        }

        // Render each project
        this.projectsData.forEach((project, index) => {
            const projectHTML = this.createProjectHTML(project, index);
            container.insertAdjacentHTML('beforeend', projectHTML);
        });

        // Initialize functionality after rendering
        this.initializeProjectFunctionality();
    }

    showNoResultsProjects(container) {
        const noResultsHTML = `
            <div class="no-results-container" style="grid-column: 1 / -1;">
                <img src="./assets/images/notFound.png" alt="Не найдено" class="no-results-image">
                <h2 class="no-results-title">Не нашли подходящей квартиры</h2>
                <p class="no-results-description">Попробуйте изменить некоторые пункты или нажмите очистить фильтр</p>
                <button class="no-results-button" id="clearFiltersNoResults">
                    <span>Очистить фильтры</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.44098 7.00618L13.2452 2.20345C13.6462 1.80254 13.6462 1.16436 13.2452 0.763453C12.8442 0.362544 12.2058 0.362544 11.8048 0.763453L7.00053 5.56618L2.1963 0.755272C1.79527 0.354363 1.15689 0.354363 0.755854 0.755272C0.35482 1.15618 0.35482 1.79436 0.755854 2.19527L5.56008 6.998L0.755854 11.8007C0.35482 12.2016 0.35482 12.8398 0.755854 13.2407C1.15689 13.6416 1.79527 13.6416 2.1963 13.2407L7.00053 8.438L11.8048 13.2407C12.2058 13.6416 12.8442 13.6416 13.2452 13.2407C13.6462 12.8398 13.6462 12.2016 13.2452 11.8007L8.44098 6.998V7.00618Z" fill="currentColor"/>
                    </svg>
                </button>
            </div>
        `;
        container.innerHTML = noResultsHTML;

        // Bind clear filters button
        const clearBtn = document.getElementById('clearFiltersNoResults');
        if (clearBtn && window.filterManager) {
            clearBtn.addEventListener('click', () => {
                window.filterManager.resetFilters();
            });
        }
    }

    createProjectHTML(project, index) {
        const isLarge = project.isLarge;
        const colSpan = isLarge ? 'sm:col-span-2' : '';

        return `
            <div class="similar-project-container space-y-[14px] ${colSpan}">
                <div class="relative z-1 rounded-[24px] overflow-hidden card-for-content ${isLarge ? 'h-[432px] lg:h-[690px]' : 'h-[432px] lg:h-[494px]'}">
                    <div class="absolute -z-1 inset-0">
                        <div class="swiper similar-project-swiper size-full">
                            <div class="swiper-wrapper size-full">
                                ${project.images.map(img => `
                                    <div class="swiper-slide h-full">
                                        <img class="full-size-img" src="${img}" alt="${project.name}">
                                    </div>
                                `).join('')}
                            </div>
                            <div class="absolute z-1 max:sm:hidden sm:bottom-2 max-lg:left-3 lg:bottom-3 lg:right-4">
                                <div class="relative -z-2 p-[1px] rounded-full bg-[#FFFFFF03] backdrop-blur-[100px] !w-auto
                                        before:content-[''] before:absolute before:-z-1 before:inset-0 before:rounded-full before:bg-linear-171 before:from-[#FFFFFF17] before:to-[#FFFFFF00]">
                                    <div class="h-full similar-project-pagination backdrop-blur-[100px] rounded-full flex items-center gap-[6px] bg-[#FFFFFF03] p-[6px]">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="size-full p-2 lg:p-4 flex flex-col justify-between items-start pointer-events-none">
                        <div class="container-badges">
                            ${project.badges.map(badge => `
                                <div class="badge-sm ${badge.customClass || ''}" data-badge-color="${badge.type}">
                                    ${badge.icon ? `<img class="icon-sm" src="${badge.icon}" alt="">` : ''}
                                    <span>${badge.text}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="max-lg:place-self-end">
                            ${this.createMobileInfoCard(project)}
                            ${this.createDesktopInfoCard(project, isLarge)}
                        </div>
                    </div>
                </div>
                <div class="relative z-1 p-2 flex items-start justify-between lg:hidden">
                    <div class="space-y-[5px]">
                        <h2 class="text-28 font-bounded">${project.name}</h2>
                        <p class="flex items-center gap-[14px] text-main-black-60 text-xs font-medium">
                            <span>${project.address}</span>
                            <span class="flex items-center gap-[6px]">
                                <img class="icon-16" src="./assets/icons/car-dark.svg" alt="">
                                <span>${project.landmark} • ${project.travelTime}</span>
                            </span>
                        </p>
                    </div>
                    <button class="py-[4px]">
                        <img class="icon-xl" src="./assets/icons/additional-dark.svg" alt="">
                    </button>
                </div>
            </div>
        `;
    }

    createMobileInfoCard(project) {
        return `
            <div class="lg:hidden bg-white rounded-[16px] overflow-hidden pointer-events-auto mobile-project-info-card">
                <div class="py-[10px] px-[14px] text-xs font-medium flex gap-[10px] items-center justify-between">
                    <span>от ${project.minPrice} млн ₸</span>
                    <button class="text-web-link mobile-info-toggle-btn">Раскрыть</button>
                </div>
                <div class="mobile-additional-info" style="max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, padding 0.3s ease-in-out;">
                    <div class="px-[14px] pb-[14px] space-y-3">
                        <div class="mini-banks">
                            ${project.banks.map(bank => `
                                <div class="mini-bank rounded-[8px] bg-main-black-15 flex gap-1 items-center font-medium">
                                    <img class="icon-xl" src="${bank.logo}" alt="${bank.name}">
                                    <span>${bank.name}</span>
                                </div>
                            `).join('')}
                        </div>
                        <ul class="flats-inf-l-mini">
                            ${project.apartments.map(apt => `
                                <li class="flex font-medium justify-between items-center text-2xs">
                                    <span class="addinf-flat">${apt.rooms}-комн.</span>
                                    <span class="min-flat-price">от ${apt.price} млн ₸</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    createDesktopInfoCard(project, isLarge) {
        const width = isLarge ? 'w-[400px] lg:w-[561px]' : 'lc-info-width';

        return `
            <div class="max-lg:hidden flex items-end gap-4">
                <div class="relative bg-white rounded-[12px] p-7 ${width} space-y-[22px]">
                    <ul class="mini-modal hidden modal absolute z-3 -top-30 lg:-top-35 max-lg:left-95 lg:-right-55 text-base font-medium bg-[#FCFCFDE5] shadow-black-6-8 rounded-[24px] backdrop-blur-[50px] py-2 w-[300px] pointer-events-none">
                        <li class="px-6 py-3 flex items-center gap-2 cursor-pointer hover:!bg-black/4 transition-colors duration-300 ease-in-out pointer-events-auto">
                            <img class="icon-md" src="./assets/icons/location-dark.svg" alt="">
                            <span>Показать на карте</span>
                        </li>
                        <li class="px-6 py-3 flex items-center gap-2 cursor-pointer hover:bg-black/4 transition-colors duration-300 ease-in-out pointer-events-auto">
                            <img class="icon-md" src="./assets/icons/note-report-dark.svg" alt="">
                            <span>Скопировать ссылку</span>
                        </li>
                        <li class="px-6 py-3 flex items-center gap-2 cursor-pointer hover:bg-black/4 transition-colors duration-300 ease-in-out pointer-events-auto">
                            <img class="icon-md" src="./assets/icons/whats-app-dark.svg" alt="">
                            <span>Отправить WhatsApp</span>
                        </li>
                    </ul>
                    <div class="flex justify-between items-start">
                        <div class="flex flex-col gap-2">
                            <div class="space-y-2">
                                <h3 class="font-bounded text-34">${project.name}</h3>
                                <p class="flex items-center gap-[14px] text-main-black-60 text-sm font-medium">
                                    <span>${project.address}</span>
                                    <span class="flex items-center gap-[6px]">
                                        <img class="icon-16" src="./assets/icons/car-dark.svg" alt="">
                                        <span class="no-wrap-space">${project.landmark} • ${project.travelTime}</span>
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button class="additional-details-similar-project-btn pointer-events-auto" data-mini-modal-trigger="click">
                            <img class="icon-xl" src="./assets/icons/additional-dark.svg" alt="">
                        </button>
                    </div>
                    <div class="additional-information-container my-0 max-h-0 overflow-hidden space-y-3 transition-all duration-300 ease-in-out">
                        <div class="flex gap-2">
                            ${project.banks.map((bank, idx) => `
                                <div class="rounded-[8px] bg-main-black-15 py-[6px] px-2 flex gap-1 items-center font-medium">
                                    <img class="icon-xl" src="${bank.logo}" alt="${bank.name}">
                                    <span class="text-base">${bank.name}</span>
                                </div>
                            `).join('')}
                            ${project.banks.length > 2 ? '<div class="rounded-[8px] bg-main-black-15 py-[6px] px-2 flex gap-1 items-center font-medium"><span class="text-base">+2</span></div>' : ''}
                        </div>
                        <ul class="flex flex-col gap-1">
                            ${project.apartments.map(apt => `
                                <li class="flex font-medium justify-between items-center">
                                    <span class="text-base text-main-black-60">${apt.rooms}-комнатние</span>
                                    <span class="text-18">от ${apt.price} млн ₸</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="flex items-end justify-between transition-all duration-300 ease-in-out">
                        <p class="text-22 font-[500]">от ${project.minPrice} млн ₸</p>
                        <button class="pointer-events-auto additional-information-btn text-web-link font-bounded text-sm">
                            <span>Подробнее</span>
                        </button>
                    </div>
                </div>
                ${isLarge && project.features ? this.createFeaturesCard(project.features) : ''}
            </div>
        `;
    }

    createFeaturesCard(features) {
        return `
            <div class="bg-white rounded-[12px] px-4 py-[21px] w-[362px] pointer-events-auto flex flex-col items-start gap-y-6">
                ${features.map(feature => `
                    <button class="flex justify-start text-left items-center gap-x-[25px] cursor-pointer" ${feature.text.includes('пруд') ? 'data-modal-target="#mapModal"' : ''}>
                        <img class="icon-main-lc" src="${feature.icon}" alt="">
                        <p class="text-sm font-medium flex-1">${feature.text}</p>
                    </button>
                `).join('')}
            </div>
        `;
    }

    initializeProjectFunctionality() {
        // Initialize Swiper for each project
        document.querySelectorAll('.similar-project-swiper').forEach((swiperEl) => {
            new Swiper(swiperEl, {
                slidesPerView: 1,
                spaceBetween: 2,
                loop: true,
                breakpoints: {
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 4,
                        loop: true,
                        pagination: {
                            el: swiperEl.querySelector('.similar-project-pagination'),
                            clickable: true,
                            renderBullet: function (index, className) {
                                return `<span class="${className}" style="background-color: #FCFCFD1A; width:8px; height:8px; margin:0; border:none;"></span>`;
                            },
                        }
                    }
                }
            });
        });

        // Initialize mobile info toggle
        new MobileProjectInfoToggle();

        // Initialize additional information toggle
        this.initAdditionalInfoToggle();

        // Initialize mini modals
        this.initMiniModals();
    }

    initAdditionalInfoToggle() {
        document.querySelectorAll('.similar-project-container').forEach(container => {
            const button = container.querySelector('.additional-information-btn');
            const list = container.querySelector('.additional-information-container');
            let hideTimeout;
            let isOpen = false;

            const showList = () => {
                list.style.maxHeight = list.scrollHeight + 'px';
                list.style.opacity = '1';
                list.style.pointerEvents = 'auto';
                list.classList.remove('my-0');
                list.classList.add('my-2');
                list.style.marginTop = '22px';
                list.style.marginBottom = '22px';
                isOpen = true;

                if (window.innerWidth < 1024) {
                    button.textContent = 'Скрыть';
                }
            };

            const hideList = () => {
                list.style.maxHeight = '0';
                list.style.opacity = '0';
                list.style.pointerEvents = 'none';
                list.classList.remove('my-2');
                list.classList.add('my-0');
                list.style.marginTop = '0px';
                list.style.marginBottom = '0px';
                isOpen = false;

                if (window.innerWidth < 1024) {
                    button.textContent = 'Раскрыть';
                }
            };

            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (window.innerWidth < 1024) {
                        if (isOpen) {
                            hideList();
                        } else {
                            showList();
                        }
                    }
                });

                button.addEventListener('mouseenter', () => {
                    if (window.innerWidth >= 1024) {
                        clearTimeout(hideTimeout);
                        showList();
                    }
                });

                button.addEventListener('mouseleave', () => {
                    if (window.innerWidth >= 1024) {
                        hideTimeout = setTimeout(hideList, 300);
                    }
                });
            }

            if (list) {
                list.addEventListener('mouseenter', () => {
                    if (window.innerWidth >= 1024) {
                        clearTimeout(hideTimeout);
                        showList();
                    }
                });

                list.addEventListener('mouseleave', () => {
                    if (window.innerWidth >= 1024) {
                        hideTimeout = setTimeout(hideList, 300);
                    }
                });
            }
        });
    }

    initMiniModals() {
        document.querySelectorAll('[data-mini-modal-trigger]').forEach(button => {
            const container = button.closest('.relative');
            if (!container) return;

            const modal = container.querySelector('.mini-modal');
            if (!modal) return;

            const triggerType = button.dataset.miniModalTrigger;

            if (triggerType === 'click') {
                button.addEventListener('click', e => {
                    e.stopPropagation();
                    modal.classList.toggle('hidden');
                });

                document.addEventListener('click', e => {
                    if (!container.contains(e.target)) {
                        modal.classList.add('hidden');
                    }
                });
            } else if (triggerType === 'hover') {
                container.addEventListener('mouseenter', () => {
                    modal.classList.remove('hidden');
                });
                container.addEventListener('mouseleave', () => {
                    modal.classList.add('hidden');
                });
            }
        });
    }
}

// Initialize projects data manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.projectsDataManager = new ProjectsDataManager();
});

// ============================================
// FLATS DATA SIMULATION & RENDERING
// ============================================

class FlatsDataManager {
    constructor() {
        // Simulated backend data for flats
        this.originalFlatsData = [
            {
                id: 1,
                projectName: 'Respublika',
                projectAddress: 'ул. Сыганак, 24',
                landmark: 'Байтерек',
                travelTime: '12 мин',
                minPrice: 21.0,
                headerImage: './assets/images/RC/rc-1.png',
                badges: [
                    { text: 'Комфорт класс', type: 'full-blur' },
                    { text: 'Развиваем район', type: 'full-blur' }
                ],
                flats: [
                    {
                        id: 101,
                        rooms: 1,
                        area: 57.58,
                        price: 21.0,
                        mortgageMonthly: 345,
                        finishing: 'Без отделки',
                        finishingStatus: 'Готовый ремонт',
                        corpus: 'B',
                        floor: 12,
                        quarter: 'II квартал 2025',
                        images: [
                            './assets/images/apartment-plan.png',
                            './assets/images/apartment-plan.png'
                        ]
                    },
                    {
                        id: 102,
                        rooms: 1,
                        area: 62.15,
                        price: 23.5,
                        mortgageMonthly: 385,
                        finishing: 'Без отделки',
                        finishingStatus: 'Готовый ремонт',
                        corpus: 'A',
                        floor: 8,
                        quarter: 'II квартал 2025',
                        images: [
                            './assets/images/apartment-plan.png',
                            './assets/images/apartment-plan.png'
                        ]
                    },
                    {
                        id: 103,
                        rooms: 2,
                        area: 78.42,
                        price: 28.0,
                        mortgageMonthly: 460,
                        finishing: 'Без отделки',
                        finishingStatus: 'Готовый ремонт',
                        corpus: 'B',
                        floor: 15,
                        quarter: 'III квартал 2025',
                        images: [
                            './assets/images/apartment-plan.png',
                            './assets/images/apartment-plan.png'
                        ]
                    },
                    {
                        id: 104,
                        rooms: 3,
                        area: 95.30,
                        price: 35.5,
                        mortgageMonthly: 580,
                        finishing: 'Без отделки',
                        finishingStatus: 'Готовый ремонт',
                        corpus: 'C',
                        floor: 10,
                        quarter: 'II квартал 2025',
                        images: [
                            './assets/images/apartment-plan.png',
                            './assets/images/apartment-plan.png'
                        ]
                    },
                    {
                        id: 101,
                        rooms: 1,
                        area: 57.58,
                        price: 21.0,
                        mortgageMonthly: 345,
                        finishing: 'Без отделки',
                        finishingStatus: 'Готовый ремонт',
                        corpus: 'B',
                        floor: 12,
                        quarter: 'II квартал 2025',
                        images: [
                            './assets/images/apartment-plan.png',
                            './assets/images/apartment-plan.png'
                        ]
                    },
                    {
                        id: 102,
                        rooms: 1,
                        area: 62.15,
                        price: 23.5,
                        mortgageMonthly: 385,
                        finishing: 'Без отделки',
                        finishingStatus: 'Готовый ремонт',
                        corpus: 'A',
                        floor: 8,
                        quarter: 'II квартал 2025',
                        images: [
                            './assets/images/apartment-plan.png',
                            './assets/images/apartment-plan.png'
                        ]
                    },
                    {
                        id: 103,
                        rooms: 2,
                        area: 78.42,
                        price: 28.0,
                        mortgageMonthly: 460,
                        finishing: 'Без отделки',
                        finishingStatus: 'Готовый ремонт',
                        corpus: 'B',
                        floor: 15,
                        quarter: 'III квартал 2025',
                        images: [
                            './assets/images/apartment-plan.png',
                            './assets/images/apartment-plan.png'
                        ]
                    },
                    {
                        id: 104,
                        rooms: 3,
                        area: 95.30,
                        price: 35.5,
                        mortgageMonthly: 580,
                        finishing: 'Без отделки',
                        finishingStatus: 'Готовый ремонт',
                        corpus: 'C',
                        floor: 10,
                        quarter: 'II квартал 2025',
                        images: [
                            './assets/images/apartment-plan.png',
                            './assets/images/apartment-plan.png'
                        ]
                    }
                ]
            },
            {
                id: 2,
                projectName: 'Eleven',
                projectAddress: 'ул. Култегин 4а',
                landmark: 'Хан Шатыр',
                travelTime: '8 мин',
                minPrice: 19.5,
                headerImage: './assets/images/RC/rc-3.jpg',
                badges: [
                    { text: 'Комфорт класс', type: 'full-blur' },
                    { text: 'Готовый дом', type: 'full-blur' }
                ],
                flats: [
                    {
                        id: 201,
                        rooms: 1,
                        area: 54.20,
                        price: 19.5,
                        mortgageMonthly: 320,
                        finishing: 'Без отделки',
                        finishingStatus: 'Готовый ремонт',
                        corpus: 'A',
                        floor: 5,
                        quarter: 'Готов',
                        images: [
                            './assets/images/apartment-plan.png',
                            './assets/images/apartment-plan.png'
                        ]
                    },
                    {
                        id: 202,
                        rooms: 2,
                        area: 72.80,
                        price: 26.0,
                        mortgageMonthly: 425,
                        finishing: 'Без отделки',
                        finishingStatus: 'Готовый ремонт',
                        corpus: 'B',
                        floor: 7,
                        quarter: 'Готов',
                        images: [
                            './assets/images/apartment-plan.png',
                            './assets/images/apartment-plan.png'
                        ]
                    },
                    {
                        id: 203,
                        rooms: 2,
                        area: 68.50,
                        price: 24.5,
                        mortgageMonthly: 400,
                        finishing: 'Без отделки',
                        finishingStatus: 'Готовый ремонт',
                        corpus: 'A',
                        floor: 12,
                        quarter: 'Готов',
                        images: [
                            './assets/images/apartment-plan.png',
                            './assets/images/apartment-plan.png'
                        ]
                    },
                    {
                        id: 204,
                        rooms: 3,
                        area: 88.90,
                        price: 32.0,
                        mortgageMonthly: 525,
                        finishing: 'Без отделки',
                        finishingStatus: 'Готовый ремонт',
                        corpus: 'B',
                        floor: 9,
                        quarter: 'Готов',
                        images: [
                            './assets/images/apartment-plan.png',
                            './assets/images/apartment-plan.png'
                        ]
                    }
                ]
            }
        ];

        this.flatsData = JSON.parse(JSON.stringify(this.originalFlatsData));
        this.init();
    }

    init() {
        // Simulate API call delay
        setTimeout(() => {
            this.renderFlats();
        }, 100);
    }

    // Simulate API call
    async fetchFlats() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.flatsData);
            }, 500);
        });
    }

    renderFlats() {
        const container = document.querySelector('#flats');
        if (!container) return;

        // Clear all existing content
        container.innerHTML = '';

        // Check if there are no flats at all
        const hasFlats = this.flatsData.some(project => project.flats && project.flats.length > 0);

        if (!hasFlats) {
            this.showNoResultsFlats(container);
            return;
        }

        // Render each project with its flats
        this.flatsData.forEach((project, projectIndex) => {
            // Only render if project has flats
            if (project.flats && project.flats.length > 0) {
                const totalFlats = project.flats.length;
                const initialVisibleFlats = Math.min(4, totalFlats);

                const projectHTML = this.createProjectHeaderHTML(project, projectIndex);
                const flatsHTML = this.createFlatsGridHTML(project.flats, initialVisibleFlats);
                const showMoreHTML = this.createShowMoreButtonHTML(project.id, totalFlats, initialVisibleFlats);

                // Insert project header
                container.insertAdjacentHTML('beforeend', projectHTML);
                // Insert flats grid
                container.insertAdjacentHTML('beforeend', flatsHTML);
                // Insert show more button
                container.insertAdjacentHTML('beforeend', showMoreHTML);
            }
        });

        // Initialize functionality after rendering
        this.initializeFlatsFunctionality();
    }

    showNoResultsFlats(container) {
        const noResultsHTML = `
            <div class="no-results-container">
                <img src="./assets/images/notFound.png" alt="Не найдено" class="no-results-image">
                <h2 class="no-results-title">Не нашли подходящей квартиры</h2>
                <p class="no-results-description">Попробуйте изменить некоторые пункты или нажмите очистить фильтр</p>
                <button class="no-results-button" id="clearFiltersNoResultsFlats">
                    <span>Очистить фильтры</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.44098 7.00618L13.2452 2.20345C13.6462 1.80254 13.6462 1.16436 13.2452 0.763453C12.8442 0.362544 12.2058 0.362544 11.8048 0.763453L7.00053 5.56618L2.1963 0.755272C1.79527 0.354363 1.15689 0.354363 0.755854 0.755272C0.35482 1.15618 0.35482 1.79436 0.755854 2.19527L5.56008 6.998L0.755854 11.8007C0.35482 12.2016 0.35482 12.8398 0.755854 13.2407C1.15689 13.6416 1.79527 13.6416 2.1963 13.2407L7.00053 8.438L11.8048 13.2407C12.2058 13.6416 12.8442 13.6416 13.2452 13.2407C13.6462 12.8398 13.6462 12.2016 13.2452 11.8007L8.44098 6.998V7.00618Z" fill="currentColor"/>
                    </svg>
                </button>
            </div>
        `;
        container.innerHTML = noResultsHTML;

        // Bind clear filters button
        const clearBtn = document.getElementById('clearFiltersNoResultsFlats');
        if (clearBtn && window.filterManager) {
            clearBtn.addEventListener('click', () => {
                window.filterManager.resetFilters();
            });
        }
    }

    createProjectHeaderHTML(project, index) {
        return `
            <!-- Residential Complex Card -->
            <div class="relative rounded-[24px] ${index > 0 ? 'mt-10' : ''} overflow-hidden h-[120px] lg:h-[140px]">
                <!-- Background Image -->
                <div class="absolute inset-0 -z-1">
                    <img class="full-size-img" src="${project.headerImage}" alt="${project.projectName}">
                    <div class="absolute inset-0 bg-[#00000066]"></div>
                </div>
                <!-- Content Overlay -->
                <div class="relative lc-card-con size-full p-4 lg:p-6 flex items-center justify-between">
                    <!-- Left Side: Title and Info -->
                    <div class="flex flex-col gap-2 lg:gap-3">
                        <h3 class="lc-title text-white font-bounded text-2xl">${project.projectName}</h3>
                        <div class="flex flex-wrap items-center gap-2">
                            ${project.badges.map(badge => `
                                <div class="badge-sm badge-border" data-badge-color="${badge.type}">
                                    <span>${badge.text}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="flex items-center gap-4 lg:gap-6 text-white text-xs lg:text-sm">
                            <span data-badge-color="full-blur" class="badge-sm badge-border flex items-center gap-[6px]">
                                <img class="icon-16" src="./assets/icons/car-light.svg" alt="">
                                <span>${project.landmark} • ${project.travelTime}</span>
                            </span>
                            <span class="font-medium badge-sm badge-border" data-badge-color="full-blur">от ${project.minPrice.toFixed(1)} 000 000 ₸</span>
                        </div>
                    </div>
                    <!-- Right Side: Map Button -->
                    <button class="live-complex-btn" data-btn-color="white" data-modal-target="#mapModal">
                        <span>На карте</span>
                    </button>
                </div>
            </div>
        `;
    }

    createFlatsGridHTML(flats, visibleCount = flats.length) {
        return `
            <!-- Flat Cards Grid -->
            <div class="flat-cards">
                ${flats.map((flat, index) => this.createFlatCardHTML(flat, index, visibleCount)).join('')}
            </div>
        `;
    }

    createFlatCardHTML(flat, index, visibleCount) {
        const isHidden = index >= visibleCount;
        return `
            <!-- Flat Card -->
            <div class="flat-card ${isHidden ? 'flat-card-hidden' : ''}" data-flat-id="${flat.id}" data-flat-index="${index}">
                <div class="flat-card-header">
                    <div class="flat-info">
                        <p class="flat-rooms">${flat.rooms} комнатная</p>
                        <p class="flat-area">${flat.area} м²</p>
                    </div>
                    <div class="flat-actions">
                        <button class="flat-action-btn">
                            <img class="icon-base" src="./assets/icons/note-report-dark.svg" alt="">
                        </button>
                        <button class="flat-action-btn">
                            <img class="icon-base" src="./assets/icons/heart-dark.svg" alt="">
                        </button>
                    </div>
                </div>
                <div class="flat-badge">
                    <span>${flat.finishing}</span>
                </div>
                <div class="flat-image-container">
                    <div class="swiper flat-swiper">
                        <div class="swiper-wrapper">
                            ${flat.images.map(img => `
                                <div class="swiper-slide">
                                    <img src="${img}" alt="План квартиры">
                                </div>
                            `).join('')}
                        </div>
                        <div class="flat-pagination swiper-pagination"></div>
                    </div>
                    <div class="flat-status">
                        <img class="icon-sm" src="./assets/icons/Paint.svg" alt="">
                        <span>${flat.finishingStatus}</span>
                    </div>
                </div>
                <div class="flat-price-section">
                    <p class="flat-price">от ${flat.price.toFixed(1)} 000 000 ₸</p>
                    <p class="flat-mortgage">
                        В ипотеку <span>от ${flat.mortgageMonthly} 000 ₸/мес</span>
                    </p>
                </div>
                <div class="flat-details">
                    <span>Корпус ${flat.corpus}</span>
                    <span>•</span>
                    <span>Этаж ${flat.floor}</span>
                    <span>•</span>
                    <span>${flat.quarter}</span>
                </div>
            </div>
        `;
    }

    createShowMoreButtonHTML(projectId, totalFlats, visibleFlats) {
        // Don't show button if less than 5 flats total
        if (totalFlats < 5) {
            return '';
        }

        const remainingFlats = totalFlats - visibleFlats;
        const nextBatchSize = Math.min(8, remainingFlats);

        return `
            <!-- Show More/Hide Buttons -->
            <div class="flats-control-buttons" data-project-id="${projectId}">
                ${remainingFlats > 0 ? `
                    <button class="btn-default show-more-flats-btn" data-btn-color="white" data-project-id="${projectId}">
                        <span>Показать еще ${nextBatchSize} ${this.pluralizeFlats(nextBatchSize)}</span>
                    </button>
                ` : ''}
                ${visibleFlats > 4 ? `
                    <button class="btn-default hide-flats-btn" data-btn-color="white" data-project-id="${projectId}">
                        <span>Скрыть</span>
                    </button>
                ` : ''}
            </div>
        `;
    }

    pluralizeFlats(count) {
        const mod10 = count % 10;
        const mod100 = count % 100;

        if (mod10 === 1 && mod100 !== 11) {
            return 'квартиру';
        } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
            return 'квартиры';
        } else {
            return 'квартир';
        }
    }

    initializeFlatsFunctionality() {
        // Initialize Swiper for each flat card
        document.querySelectorAll('.flat-swiper').forEach((swiperEl) => {
            new Swiper(swiperEl, {
                slidesPerView: 1,
                spaceBetween: 0,
                pagination: {
                    el: swiperEl.querySelector('.flat-pagination'),
                    clickable: true,
                },
            });
        });

        // Initialize show more buttons
        document.querySelectorAll('.show-more-flats-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const projectId = btn.dataset.projectId;
                this.showMoreFlats(projectId);
            });
        });

        // Initialize hide buttons
        document.querySelectorAll('.hide-flats-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const projectId = btn.dataset.projectId;
                this.hideFlats(projectId);
            });
        });

        // Initialize favorite buttons
        document.querySelectorAll('.flat-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const icon = btn.querySelector('img');
                if (icon && icon.src.includes('heart')) {
                    // Toggle favorite state
                    console.log('Favorite toggled');
                }
            });
        });
    }

    showMoreFlats(projectId) {
        // Find the project
        const project = this.flatsData.find(p => p.id === parseInt(projectId));
        if (!project) return;

        // Find all flat cards for this project
        const flatCards = document.querySelectorAll(`.flat-card[data-flat-id]`);
        const projectFlats = Array.from(flatCards).filter(card => {
            const flatId = parseInt(card.dataset.flatId);
            return project.flats.some(f => f.id === flatId);
        });

        // Count currently visible flats
        const visibleFlats = projectFlats.filter(card => !card.classList.contains('flat-card-hidden'));
        const currentVisibleCount = visibleFlats.length;

        // Show next 8 flats
        const hiddenFlats = projectFlats.filter(card => card.classList.contains('flat-card-hidden'));
        const flatsToShow = hiddenFlats.slice(0, 8);

        flatsToShow.forEach((card, index) => {
            setTimeout(() => {
                card.classList.remove('flat-card-hidden');
                card.classList.add('flat-card-visible');
            }, index * 50); // Stagger animation
        });

        // Update buttons
        setTimeout(() => {
            const newVisibleCount = currentVisibleCount + flatsToShow.length;
            const remainingHidden = hiddenFlats.length - flatsToShow.length;

            const controlButtons = document.querySelector(`.flats-control-buttons[data-project-id="${projectId}"]`);
            if (controlButtons) {
                const totalFlats = project.flats.length;
                const showMoreHTML = this.createShowMoreButtonHTML(projectId, totalFlats, newVisibleCount);
                controlButtons.outerHTML = showMoreHTML;

                // Re-bind events
                this.initializeFlatsFunctionality();
            }
        }, flatsToShow.length * 50 + 100);
    }

    hideFlats(projectId) {
        // Find the project
        const project = this.flatsData.find(p => p.id === parseInt(projectId));
        if (!project) return;

        // Find all flat cards for this project
        const flatCards = document.querySelectorAll(`.flat-card[data-flat-id]`);
        const projectFlats = Array.from(flatCards).filter(card => {
            const flatId = parseInt(card.dataset.flatId);
            return project.flats.some(f => f.id === flatId);
        });

        // Hide all except first 4
        const flatsToHide = projectFlats.slice(4);

        flatsToHide.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('flat-card-hiding');

                setTimeout(() => {
                    card.classList.remove('flat-card-visible', 'flat-card-hiding');
                    card.classList.add('flat-card-hidden');
                }, 300);
            }, index * 30);
        });

        // Update buttons
        setTimeout(() => {
            const controlButtons = document.querySelector(`.flats-control-buttons[data-project-id="${projectId}"]`);
            if (controlButtons) {
                const totalFlats = project.flats.length;
                const showMoreHTML = this.createShowMoreButtonHTML(projectId, totalFlats, 4);
                controlButtons.outerHTML = showMoreHTML;

                // Re-bind events
                this.initializeFlatsFunctionality();
            }
        }, flatsToHide.length * 30 + 400);
    }

    // Method to get all flats as a flat array (useful for filtering)
    getAllFlats() {
        const allFlats = [];
        this.originalFlatsData.forEach(project => {
            project.flats.forEach(flat => {
                allFlats.push({
                    ...flat,
                    projectName: project.projectName,
                    projectAddress: project.projectAddress,
                    landmark: project.landmark,
                    travelTime: project.travelTime,
                    headerImage: project.headerImage,
                    badges: project.badges,
                    minPrice: project.minPrice
                });
            });
        });
        return allFlats;
    }

    // Method to filter flats (will be used later)
    filterFlats(filters) {
        // This will be implemented when adding filter functionality
        console.log('Filtering flats with:', filters);
    }
}

// Initialize flats data manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.flatsDataManager = new FlatsDataManager();
});

// ============================================
// UNIFIED FILTER SYSTEM
// ============================================

class FilterManager {
    constructor(projectsManager, flatsManager) {
        this.projectsManager = projectsManager;
        this.flatsManager = flatsManager;

        this.filters = {
            priceMin: 0,
            priceMax: 1000,
            rooms: [],
            deadline: [],
            mortgageOnly: false,
            discountOnly: false
        };

        this.init();
    }

    init() {
        this.bindDesktopFilters();
        this.bindMobileFilters();
        this.bindResetButtons();
        this.syncFilters();
        this.updateResetButtonVisibility(); // Hide reset button initially
    }

    // Bind desktop filter controls
    bindDesktopFilters() {
        const desktopFilter = document.querySelector('.filters');
        if (!desktopFilter) return;

        // Room checkboxes
        desktopFilter.querySelectorAll('.room-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const value = e.target.closest('.room-option').querySelector('.rooms-amount-b').textContent.trim();
                this.updateRoomFilter(value, e.target.checked);
                this.syncMobileRoomCheckbox(value, e.target.checked);
                this.applyFilters();
            });
        });

        // Deadline checkboxes
        desktopFilter.querySelectorAll('.deadline-list .room-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const value = e.target.closest('.room-option').querySelector('.deadline-option').textContent.trim();
                this.updateDeadlineFilter(value, e.target.checked);
                this.syncMobileDeadlineCheckbox(value, e.target.checked);
                this.applyFilters();
            });
        });

        // Additional options (mortgage, discount) - find them in the additional options section
        const additionalOptionsSection = document.querySelector('.lg\\:space-y-\\[33px\\] .space-y-2');
        if (additionalOptionsSection) {
            const additionalCheckboxes = additionalOptionsSection.querySelectorAll('input[type="checkbox"]');

            if (additionalCheckboxes[0]) {
                additionalCheckboxes[0].addEventListener('change', (e) => {
                    this.filters.mortgageOnly = e.target.checked;
                    this.syncMobileAdditionalCheckbox('mortgage', e.target.checked);
                    this.applyFilters();
                });
            }

            if (additionalCheckboxes[1]) {
                additionalCheckboxes[1].addEventListener('change', (e) => {
                    this.filters.discountOnly = e.target.checked;
                    this.syncMobileAdditionalCheckbox('discount', e.target.checked);
                    this.applyFilters();
                });
            }
        }

        // Price range slider
        this.initDesktopRangeSlider(desktopFilter);
    }

    // Bind mobile filter controls
    bindMobileFilters() {
        const mobileFilter = document.getElementById('filterSidebarMobile');
        if (!mobileFilter) return;

        // Room checkboxes
        mobileFilter.querySelectorAll('.filter-room-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const value = e.target.dataset.value;
                this.updateRoomFilter(value, e.target.checked);
                this.syncDesktopRoomCheckbox(value, e.target.checked);
                this.applyFilters();
            });
        });

        // Deadline checkboxes
        mobileFilter.querySelectorAll('.filter-delivery-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const value = e.target.dataset.value === 'ready' ? 'Готовый дом' : '2025';
                this.updateDeadlineFilter(value, e.target.checked);
                this.syncDesktopDeadlineCheckbox(value, e.target.checked);
                this.applyFilters();
            });
        });

        // Additional options
        mobileFilter.querySelectorAll('.filter-additional-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const value = e.target.dataset.value;
                if (value === 'mortgage') {
                    this.filters.mortgageOnly = e.target.checked;
                } else if (value === 'discount') {
                    this.filters.discountOnly = e.target.checked;
                }
                this.syncDesktopAdditionalCheckbox(value, e.target.checked);
                this.applyFilters();
            });
        });

        // Price range slider
        this.initMobileRangeSlider(mobileFilter);

        // Apply filters button
        const applyBtn = document.getElementById('btnApplyFilters');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyFilters();
                // Close mobile filter sidebar
                const closeBtn = document.getElementById('btnCloseFilterSidebar');
                if (closeBtn) closeBtn.click();
            });
        }
    }

    // Initialize desktop range slider
    initDesktopRangeSlider(container) {
        const rangeSlider = container.querySelector('.range-slider');
        if (!rangeSlider) return;

        const track = rangeSlider.querySelector('.range-track');
        const fill = rangeSlider.querySelector('.range-fill');
        const minThumb = rangeSlider.querySelector('.range-thumb-min');
        const maxThumb = rangeSlider.querySelector('.range-thumb-max');
        const minPrice = rangeSlider.querySelector('.range-min');
        const maxPrice = rangeSlider.querySelector('.range-max');

        let dragging = null;
        const maxValue = 1000;
        const minGap = 10;

        const updateUI = () => {
            const minPercent = (this.filters.priceMin / maxValue) * 100;
            const maxPercent = (this.filters.priceMax / maxValue) * 100;

            minThumb.style.left = `calc(${minPercent}% - 8px)`;
            maxThumb.style.left = `calc(${maxPercent}% - 8px)`;
            fill.style.left = `${minPercent}%`;
            fill.style.width = `${maxPercent - minPercent}%`;

            minPrice.textContent = this.filters.priceMin;
            maxPrice.textContent = this.filters.priceMax;

            // Sync with mobile
            this.syncMobileRangeSlider();
        };

        const onDrag = (x) => {
            if (!dragging) return;

            const rect = track.getBoundingClientRect();
            let percent = (x - rect.left) / rect.width;
            percent = Math.min(Math.max(percent, 0), 1);
            const value = Math.round(percent * maxValue);

            if (dragging === minThumb) {
                this.filters.priceMin = Math.min(value, this.filters.priceMax - minGap);
            } else {
                this.filters.priceMax = Math.max(value, this.filters.priceMin + minGap);
            }

            updateUI();
        };

        const startDrag = (e, thumb) => {
            e.preventDefault();
            dragging = thumb;
        };

        const stopDrag = () => {
            if (dragging) {
                this.applyFilters();
            }
            dragging = null;
        };

        [minThumb, maxThumb].forEach(thumb => {
            thumb.addEventListener('mousedown', e => startDrag(e, thumb));
            thumb.addEventListener('touchstart', e => startDrag(e, thumb), { passive: false });
        });

        window.addEventListener('mousemove', e => onDrag(e.clientX));
        window.addEventListener('touchmove', e => onDrag(e.touches[0].clientX), { passive: false });
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchend', stopDrag);

        updateUI();
    }

    // Initialize mobile range slider
    initMobileRangeSlider(container) {
        const rangeSlider = container.querySelector('.range-slider');
        if (!rangeSlider) return;

        const track = rangeSlider.querySelector('.range-track');
        const fill = rangeSlider.querySelector('.range-fill');
        const minThumb = rangeSlider.querySelector('.range-thumb-min');
        const maxThumb = rangeSlider.querySelector('.range-thumb-max');
        const minPrice = rangeSlider.querySelector('.range-min');
        const maxPrice = rangeSlider.querySelector('.range-max');

        let dragging = null;
        const maxValue = 1000;
        const minGap = 10;

        const updateUI = () => {
            const minPercent = (this.filters.priceMin / maxValue) * 100;
            const maxPercent = (this.filters.priceMax / maxValue) * 100;

            minThumb.style.left = `calc(${minPercent}% - 8px)`;
            maxThumb.style.left = `calc(${maxPercent}% - 8px)`;
            fill.style.left = `${minPercent}%`;
            fill.style.width = `${maxPercent - minPercent}%`;

            minPrice.textContent = this.filters.priceMin;
            maxPrice.textContent = this.filters.priceMax;

            // Sync with desktop
            this.syncDesktopRangeSlider();
        };

        const onDrag = (x) => {
            if (!dragging) return;

            const rect = track.getBoundingClientRect();
            let percent = (x - rect.left) / rect.width;
            percent = Math.min(Math.max(percent, 0), 1);
            const value = Math.round(percent * maxValue);

            if (dragging === minThumb) {
                this.filters.priceMin = Math.min(value, this.filters.priceMax - minGap);
            } else {
                this.filters.priceMax = Math.max(value, this.filters.priceMin + minGap);
            }

            updateUI();
        };

        const startDrag = (e, thumb) => {
            e.preventDefault();
            dragging = thumb;
        };

        const stopDrag = () => {
            if (dragging) {
                this.applyFilters();
            }
            dragging = null;
        };

        [minThumb, maxThumb].forEach(thumb => {
            thumb.addEventListener('mousedown', e => startDrag(e, thumb));
            thumb.addEventListener('touchstart', e => startDrag(e, thumb), { passive: false });
        });

        window.addEventListener('mousemove', e => onDrag(e.clientX));
        window.addEventListener('touchmove', e => onDrag(e.touches[0].clientX), { passive: false });
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchend', stopDrag);

        updateUI();
    }

    // Update room filter
    updateRoomFilter(value, checked) {
        if (checked) {
            if (!this.filters.rooms.includes(value)) {
                this.filters.rooms.push(value);
            }
        } else {
            this.filters.rooms = this.filters.rooms.filter(r => r !== value);
        }
    }

    // Update deadline filter
    updateDeadlineFilter(value, checked) {
        if (checked) {
            if (!this.filters.deadline.includes(value)) {
                this.filters.deadline.push(value);
            }
        } else {
            this.filters.deadline = this.filters.deadline.filter(d => d !== value);
        }
    }

    // Sync filters between desktop and mobile
    syncMobileRoomCheckbox(value, checked) {
        const mobileCheckbox = document.querySelector(`.filter-room-checkbox[data-value="${value}"]`);
        if (mobileCheckbox) {
            mobileCheckbox.checked = checked;
        }
    }

    syncDesktopRoomCheckbox(value, checked) {
        const desktopCheckboxes = document.querySelectorAll('.filters .room-checkbox');
        desktopCheckboxes.forEach(checkbox => {
            const label = checkbox.closest('.room-option').querySelector('.rooms-amount-b');
            if (label && label.textContent.trim() === value) {
                checkbox.checked = checked;
            }
        });
    }

    syncMobileDeadlineCheckbox(value, checked) {
        const dataValue = value === 'Готовый дом' ? 'ready' : '2025';
        const mobileCheckbox = document.querySelector(`.filter-delivery-checkbox[data-value="${dataValue}"]`);
        if (mobileCheckbox) {
            mobileCheckbox.checked = checked;
        }
    }

    syncDesktopDeadlineCheckbox(value, checked) {
        const desktopCheckboxes = document.querySelectorAll('.deadline-list .room-checkbox');
        desktopCheckboxes.forEach(checkbox => {
            const label = checkbox.closest('.room-option').querySelector('.deadline-option');
            if (label && label.textContent.trim() === value) {
                checkbox.checked = checked;
            }
        });
    }

    syncMobileAdditionalCheckbox(type, checked) {
        const mobileCheckbox = document.querySelector(`.filter-additional-checkbox[data-value="${type}"]`);
        if (mobileCheckbox) {
            mobileCheckbox.checked = checked;
        }
    }

    syncDesktopAdditionalCheckbox(type, checked) {
        const additionalOptionsSection = document.querySelector('.lg\\:space-y-\\[33px\\] .space-y-2');
        if (!additionalOptionsSection) return;

        const checkboxes = additionalOptionsSection.querySelectorAll('input[type="checkbox"]');
        if (type === 'mortgage' && checkboxes[0]) {
            checkboxes[0].checked = checked;
        } else if (type === 'discount' && checkboxes[1]) {
            checkboxes[1].checked = checked;
        }
    }

    syncMobileRangeSlider() {
        const mobileSlider = document.querySelector('#filterSidebarMobile .range-slider');
        if (!mobileSlider) return;

        const minPrice = mobileSlider.querySelector('.range-min');
        const maxPrice = mobileSlider.querySelector('.range-max');
        const minThumb = mobileSlider.querySelector('.range-thumb-min');
        const maxThumb = mobileSlider.querySelector('.range-thumb-max');
        const fill = mobileSlider.querySelector('.range-fill');

        if (minPrice) minPrice.textContent = this.filters.priceMin;
        if (maxPrice) maxPrice.textContent = this.filters.priceMax;

        const maxValue = 1000;
        const minPercent = (this.filters.priceMin / maxValue) * 100;
        const maxPercent = (this.filters.priceMax / maxValue) * 100;

        if (minThumb) minThumb.style.left = `calc(${minPercent}% - 8px)`;
        if (maxThumb) maxThumb.style.left = `calc(${maxPercent}% - 8px)`;
        if (fill) {
            fill.style.left = `${minPercent}%`;
            fill.style.width = `${maxPercent - minPercent}%`;
        }
    }

    syncDesktopRangeSlider() {
        const desktopSlider = document.querySelector('.filters .range-slider');
        if (!desktopSlider) return;

        const minPrice = desktopSlider.querySelector('.range-min');
        const maxPrice = desktopSlider.querySelector('.range-max');
        const minThumb = desktopSlider.querySelector('.range-thumb-min');
        const maxThumb = desktopSlider.querySelector('.range-thumb-max');
        const fill = desktopSlider.querySelector('.range-fill');

        if (minPrice) minPrice.textContent = this.filters.priceMin;
        if (maxPrice) maxPrice.textContent = this.filters.priceMax;

        const maxValue = 1000;
        const minPercent = (this.filters.priceMin / maxValue) * 100;
        const maxPercent = (this.filters.priceMax / maxValue) * 100;

        if (minThumb) minThumb.style.left = `calc(${minPercent}% - 8px)`;
        if (maxThumb) maxThumb.style.left = `calc(${maxPercent}% - 8px)`;
        if (fill) {
            fill.style.left = `${minPercent}%`;
            fill.style.width = `${maxPercent - minPercent}%`;
        }
    }

    syncFilters() {
        // Initial sync of all filters
        this.syncMobileRangeSlider();
        this.syncDesktopRangeSlider();
    }

    // Bind reset buttons
    bindResetButtons() {
        // Desktop reset button
        const desktopResetBtn = document.getElementById('clearFilters');
        if (desktopResetBtn) {
            desktopResetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.resetFilters();
            });
        }

        // Mobile reset button
        const mobileResetBtn = document.getElementById('btnResetFilters');
        if (mobileResetBtn) {
            mobileResetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    }

    // Reset all filters
    resetFilters() {
        // Reset filter values
        this.filters = {
            priceMin: 0,
            priceMax: 1000,
            rooms: [],
            deadline: [],
            mortgageOnly: false,
            discountOnly: false
        };

        // Reset all checkboxes
        document.querySelectorAll('.room-checkbox, .filter-room-checkbox, .filter-delivery-checkbox, .filter-additional-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset desktop additional options
        const additionalOptionsSection = document.querySelector('.lg\\:space-y-\\[33px\\] .space-y-2');
        if (additionalOptionsSection) {
            additionalOptionsSection.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
        }

        // Reset deadline checkboxes in desktop filter
        document.querySelectorAll('.deadline-list .room-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset range sliders to initial values
        this.filters.priceMin = 0;
        this.filters.priceMax = 1000;
        this.syncMobileRangeSlider();
        this.syncDesktopRangeSlider();

        // Restore original data
        if (this.projectsManager) {
            this.projectsManager.projectsData = JSON.parse(JSON.stringify(this.projectsManager.originalProjectsData));
            this.projectsManager.renderProjects();
        }

        if (this.flatsManager) {
            this.flatsManager.flatsData = JSON.parse(JSON.stringify(this.flatsManager.originalFlatsData));
            this.flatsManager.renderFlats();
        }

        // Update button text
        this.updateFilterButtonText();

        // Update reset button visibility
        this.updateResetButtonVisibility();
    }

    // Apply filters to projects and flats
    applyFilters() {
        console.log('Applying filters:', this.filters);

        // Filter projects (only by deadline)
        this.filterProjects();

        // Filter flats (by all criteria)
        this.filterFlats();

        // Update button text
        this.updateFilterButtonText();

        // Update reset button visibility
        this.updateResetButtonVisibility();
    }

    // Filter projects
    filterProjects() {
        if (!this.projectsManager) return;

        const allProjects = JSON.parse(JSON.stringify(this.projectsManager.originalProjectsData));
        let filteredProjects = [...allProjects];

        // Filter by deadline if selected
        if (this.filters.deadline.length > 0) {
            filteredProjects = filteredProjects.filter(project => {
                return project.badges.some(badge => {
                    return this.filters.deadline.some(deadline => {
                        if (deadline === 'Готовый дом') {
                            return badge.text === 'Готовый дом';
                        } else if (deadline === '2025') {
                            return badge.text.includes('2025') || badge.text === 'Есть готовые очереди';
                        }
                        return false;
                    });
                });
            });
        }

        // Re-render projects
        this.projectsManager.projectsData = filteredProjects;
        this.projectsManager.renderProjects();
    }

    // Filter flats
    filterFlats() {
        if (!this.flatsManager) return;

        // Get fresh copy of original data
        const allProjects = JSON.parse(JSON.stringify(this.flatsManager.originalFlatsData));
        let filteredProjects = [];

        allProjects.forEach(project => {
            let filteredFlats = [...project.flats];

            // Filter by price
            filteredFlats = filteredFlats.filter(flat => {
                return flat.price >= this.filters.priceMin && flat.price <= this.filters.priceMax;
            });

            // Filter by rooms
            if (this.filters.rooms.length > 0) {
                filteredFlats = filteredFlats.filter(flat => {
                    return this.filters.rooms.some(room => {
                        if (room === '4+') {
                            return flat.rooms >= 4;
                        }
                        return flat.rooms === parseInt(room);
                    });
                });
            }

            // Filter by deadline
            if (this.filters.deadline.length > 0) {
                filteredFlats = filteredFlats.filter(flat => {
                    return this.filters.deadline.some(deadline => {
                        if (deadline === 'Готовый дом') {
                            return flat.quarter === 'Готов';
                        } else if (deadline === '2025') {
                            return flat.quarter.includes('2025');
                        }
                        return false;
                    });
                });
            }

            // Only include project if it has flats after filtering
            if (filteredFlats.length > 0) {
                filteredProjects.push({
                    ...project,
                    flats: filteredFlats
                });
            }
        });

        // Re-render flats
        this.flatsManager.flatsData = filteredProjects;
        this.flatsManager.renderFlats();
    }

    // Group flats by project
    groupFlatsByProject(flats) {
        const grouped = {};

        flats.forEach(flat => {
            if (!grouped[flat.projectName]) {
                // Find original project data
                const originalProject = this.flatsManager.flatsData.find(p => p.projectName === flat.projectName);
                if (originalProject) {
                    grouped[flat.projectName] = {
                        ...originalProject,
                        flats: []
                    };
                }
            }

            if (grouped[flat.projectName]) {
                grouped[flat.projectName].flats.push(flat);
            }
        });

        return Object.values(grouped);
    }

    // Helper function for Russian pluralization
    pluralizeRussian(count, one, few, many) {
        const mod10 = count % 10;
        const mod100 = count % 100;

        if (mod10 === 1 && mod100 !== 11) {
            return one; // 1 квартира, 21 квартира
        } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
            return few; // 2 квартиры, 3 квартиры, 4 квартиры
        } else {
            return many; // 5 квартир, 11 квартир, 100 квартир
        }
    }

    // Update filter button text with count
    updateFilterButtonText() {
        // Get all flats from original data
        const allProjects = this.flatsManager.originalFlatsData;
        let allFlats = [];

        allProjects.forEach(project => {
            project.flats.forEach(flat => {
                allFlats.push(flat);
            });
        });

        // Apply same filters to count
        let filtered = [...allFlats];

        filtered = filtered.filter(flat => {
            return flat.price >= this.filters.priceMin && flat.price <= this.filters.priceMax;
        });

        if (this.filters.rooms.length > 0) {
            filtered = filtered.filter(flat => {
                return this.filters.rooms.some(room => {
                    if (room === '4+') return flat.rooms >= 4;
                    return flat.rooms === parseInt(room);
                });
            });
        }

        if (this.filters.deadline.length > 0) {
            filtered = filtered.filter(flat => {
                return this.filters.deadline.some(deadline => {
                    if (deadline === 'Готовый дом') return flat.quarter === 'Готов';
                    if (deadline === '2025') return flat.quarter.includes('2025');
                    return false;
                });
            });
        }

        const filteredCount = filtered.length;
        const pluralForm = this.pluralizeRussian(filteredCount, 'квартира', 'квартиры', 'квартир');

        // Update desktop button
        const desktopBtn = document.querySelector('.filters .btn-default[data-btn-color="green"] span');
        if (desktopBtn) {
            desktopBtn.textContent = `${filteredCount} ${pluralForm}`;
        }

        // Update mobile button
        const mobileBtn = document.querySelector('#btnApplyFilters span');
        if (mobileBtn) {
            mobileBtn.textContent = `Показать ${filteredCount} ${pluralForm}`;
        }
    }

    // Update reset button visibility
    updateResetButtonVisibility() {
        const hasActiveFilters =
            this.filters.rooms.length > 0 ||
            this.filters.deadline.length > 0 ||
            this.filters.mortgageOnly ||
            this.filters.discountOnly ||
            this.filters.priceMin > 0 ||
            this.filters.priceMax < 1000;

        // Desktop reset button
        const desktopResetBtn = document.querySelector('#clearFilters');
        if (desktopResetBtn) {
            if (hasActiveFilters) {
                desktopResetBtn.style.display = 'flex';
                desktopResetBtn.style.pointerEvents = 'auto';
                desktopResetBtn.style.opacity = '1';
            } else {
                desktopResetBtn.style.display = 'none';
            }
        }
    }

    // Check if any filters are active
    hasActiveFilters() {
        return this.filters.rooms.length > 0 ||
            this.filters.deadline.length > 0 ||
            this.filters.mortgageOnly ||
            this.filters.discountOnly ||
            this.filters.priceMin > 0 ||
            this.filters.priceMax < 1000;
    }
}

// Initialize filter manager after data managers are ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for data managers to initialize
    setTimeout(() => {
        const projectsManager = window.projectsDataManager;
        const flatsManager = window.flatsDataManager;

        if (projectsManager && flatsManager) {
            window.filterManager = new FilterManager(projectsManager, flatsManager);

            // Set initial button text with correct count
            window.filterManager.updateFilterButtonText();
        }

        // Re-bind modal triggers after dynamic content is loaded
        setTimeout(() => {
            document.querySelectorAll('[data-modal-target="#mapModal"]').forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const modal = document.querySelector('#mapModal');
                    if (modal) {
                        modal.classList.remove('hidden');
                        document.body.style.overflow = 'hidden';
                    }
                });
            });
        }, 300);
    }, 200);
});
