import type { Meta, StoryObj } from '@storybook/angular';
import { PromoSummaryComponent } from '../app/shared/footer/promo-summary/promo-summary.component';



const meta: Meta<PromoSummaryComponent> = {
  title: 'Shop/PromoSummary',
  component: PromoSummaryComponent,
  tags: ['autodocs'],
  argTypes: {
    total: { control: 'number' },
    discount: { control: 'number' },
    applyPromo: { action: 'applyPromo' },
  },
};

export default meta;
type Story = StoryObj<PromoSummaryComponent>;

export const NoPromo: Story = {
  args: {
    total: 120,
    discount: 0,
  },
};

export const WithPromo: Story = {
  args: {
    total: 120,
    discount: 20,
  },
};
