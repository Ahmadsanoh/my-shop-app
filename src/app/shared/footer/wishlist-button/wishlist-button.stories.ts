import type { Meta, StoryObj } from '@storybook/angular';
import { WishlistButtonComponent } from './wishlist-button.component';


const meta: Meta<WishlistButtonComponent> = {
  title: 'Shop/WishlistButton',
  component: WishlistButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    isInWishlist: { control: 'boolean' },
    toggleWishlist: { action: 'toggleWishlist' },
  },
};

export default meta;
type Story = StoryObj<WishlistButtonComponent>;

export const Default: Story = {
  args: {
    isInWishlist: false,
  },
};

export const AlreadyInWishlist: Story = {
  args: {
    isInWishlist: true,
  },
};
