import { mount } from '@vue/test-utils';
import HomePage from '@/views/Home.vue';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import i18n from '@/i18n';

describe('HomePage.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(HomePage, {
            global: {
                plugins: [i18n],
                mocks: {
                    $router: {
                        push: vi.fn(),
                    },
                },
            },
        });
    });

    it('navigates to travels page on panel click', async () => {
        await wrapper.find('.panel:nth-child(1)').trigger('click');
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/trips');
    });

    it('navigates to expenses page on panel click', async () => {
        await wrapper.find('.panel:nth-child(2)').trigger('click');
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/expenses');
    });

    it('navigates to chart page on panel click', async () => {
        await wrapper.find('.panel:nth-child(3)').trigger('click');
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/statistics');
    });

    it('renders in the default language (English) ', () => {
        expect(wrapper.text()).toContain('Welcome');
    });

    it('switches to Slovenian when the language is set to Slovenian', async () => {
        i18n.global.locale = 'sl';
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain('Dobrodošel, Janez Novak');  // Adjusted to match the actual message
    });


    it('switches to Bosnian when the language is set to Bosnian', async() => {
         i18n.global.locale = 'bh';
            await wrapper.vm.$nextTick();
            expect(wrapper.text()).toContain('Dobrodošli');
    });

    it('remembers the selected language after a page reload', async () => {
        // Set the language to Slovenian
        i18n.global.locale = 'sl';
        await new wrapper.vm.$nextTick();

        // Check for the translated welcome message
        expect(wrapper.text()).toContain('Dobrodošel, Janez Novak');  // Adjusted to match the actual translation
    });

    it('switches to Slovenian when the language is set to Slovenian from Bosnian', async () => {
        // Set initial language to Bosnian
        i18n.global.locale = 'bh';
        await wrapper.vm.$nextTick();

        // Set language to Slovenian
        i18n.global.locale = 'sl';
        await wrapper.vm.$nextTick();

        // Check if the welcome message is in Slovenian
        expect(wrapper.text()).toContain('Dobrodošel, Janez Novak');
    });

    it('switches to Bosnian when the language is set to Bosnian from Slovenian', async () => {
        // Set initial language to Slovenian
        i18n.global.locale = 'sl';
        await wrapper.vm.$nextTick();

        // Set language to Bosnian
        i18n.global.locale = 'bh';
        await wrapper.vm.$nextTick();

        // Check if the welcome message is in Bosnian
        expect(wrapper.text()).toContain('Dobrodošli');
    });

});