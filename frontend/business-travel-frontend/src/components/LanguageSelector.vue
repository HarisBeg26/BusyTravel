<template>
  <div class="language-selector" v-click-outside="closeDropdown">
    <button class="language-button" @click="toggleDropdown">
      <i class="pi pi-globe"></i>
      <span class="current-language">{{ currentLanguageLabel }}</span>
      <i class="pi pi-chevron-down" :class="{ 'dropdown-open': isOpen }"></i>
    </button>

    <div class="language-dropdown" v-show="isOpen">
      <button
        v-for="(label, code) in languages"
        :key="code"
        class="language-option"
        :class="{ 'active': currentLocale === code }"
        @click="selectLanguage(code)"
      >
        <span class="language-name">{{ label }}</span>
        <i v-if="currentLocale === code" class="pi pi-check"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LanguageSelector',
  data() {
    return {
      isOpen: false,
      languages: {
        'en': 'English',
        'sl': 'Slovenščina',
        'bh': 'Bosanski'
      }
    }
  },
  computed: {
    currentLocale() {
      return this.$i18n.locale;
    },
    currentLanguageLabel() {
      return this.languages[this.currentLocale] || 'Select Language';
    }
  },
  directives: {
    'click-outside': {
      mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event);
          }
        };
        document.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent);
      },
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    closeDropdown() {
      this.isOpen = false;
    },
    selectLanguage(locale) {
      this.$i18n.locale = locale;
      localStorage.setItem('userLanguage', locale);
      this.closeDropdown();
    }
  }
}
</script>

<style scoped>
.language-selector {
  position: relative;
  z-index: 100;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.language-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.language-button:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.current-language {
  font-weight: 600;
  color: #1e293b;
}

.pi-globe {
  color: #3b82f6;
}

.pi-chevron-down {
  color: #64748b;
  transition: transform 0.2s ease;
}

.pi-chevron-down.dropdown-open {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 200px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  animation: dropdownFade 0.2s ease;
}

.language-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: #374151;
  font-size: 0.95rem;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.language-option:hover {
  background: #f3f4f6;
}

.language-option.active {
  color: #2563eb;
  background: #eff6ff;
  font-weight: 500;
}

.language-name {
  margin-right: 1rem;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .language-dropdown {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    border-radius: 12px 12px 0 0;
    padding: 1rem;
    animation: slideUp 0.3s ease;
  }

  .language-option {
    padding: 1rem;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
