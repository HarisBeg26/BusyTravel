import { mount } from '@vue/test-utils';
import HomePage from '@/views/Home.vue';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('HomePage.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(HomePage, {
            global: {
                mocks: {
                    $router: {
                        push: vi.fn(),
                    },
                },
            },
        });
    });

    it('renders header and panels correctly', () => {
        expect(wrapper.find('.header').exists()).toBe(true);
        expect(wrapper.find('.header h1').text()).toBe('Dobrodošel Janez Novak');
        expect(wrapper.findAll('.panel').length).toBe(3);
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
});