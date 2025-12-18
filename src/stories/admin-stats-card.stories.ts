import { Meta, StoryObj } from '@storybook/angular';
import { AdminStatsCardComponent } from '../app/shared/footer/admin-stats-card.component';


export default {
  title: 'Admin/AdminStatsCard',
  component: AdminStatsCardComponent,
  argTypes: {
    title: { control: 'text' },
    value: { control: 'number' },
    trend: { control: 'number' }
  }
} as Meta<AdminStatsCardComponent>;

export const Default: StoryObj<AdminStatsCardComponent> = {
  args: {
    title: 'Total Revenue',
    value: 75000,
    trend: 12
  }
};

export const NegativeTrend: StoryObj<AdminStatsCardComponent> = {
  args: {
    title: 'Refunds',
    value: 3200,
    trend: -8
  }
};
