# rustyclint

A powerful cloud-based linting and code analysis platform with real-time collaboration and AI-powered features.

## Features

- 🦀 **Code Analysis**: Advanced linting and code quality analysis
- 📱 **Multi-Language Support**: Support for Rust, Python, JavaScript, TypeScript, and more
- 🤝 **Real-time Collaboration**: Work together with your team in real-time
- 🤖 **AI/ML Integration**: Advanced AI and machine learning capabilities
- 🛒 **Developer Marketplace**: Connect with expert developers worldwide
- 🎯 **Project Templates**: Quick start with pre-built templates
- 📊 **Performance Analytics**: Monitor your app's performance
- 🔒 **Secure Authentication**: Powered by Supabase Auth

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Payments**: Stripe
- **Icons**: Lucide React
- **Languages Supported**: Rust, Python, Dart, Kotlin, TypeScript, Java

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/rustyclint.git
cd rustyclint
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
   - Add your Supabase project URL and anon key
   - Add your Stripe publishable key
   - Configure other settings as needed

5. Start the development server:
```bash
npm run dev
```

### Environment Variables

The application uses the following environment variables:

#### Required
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

#### Optional
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key for payments  
- `VITE_APP_NAME`: Application name (default: "rustyclint")
- `VITE_DEBUG_MODE`: Enable debug mode (default: true in development)

See `.env.example` for a complete list of available environment variables.

### Supabase Setup

1. Create a new Supabase project
2. Run the database migrations:
```bash
npx supabase db push
```
3. Deploy the edge functions:
```bash
npx supabase functions deploy
```

### Stripe Setup

✅ **Stripe is already configured and ready to use!**

Your Stripe integration includes:
- **Products configured**: Enterprise Plan ($199/month), Premium Plan ($79), Support options ($5-$25)
- **Webhooks set up**: Pointing to your Supabase edge functions
- **Database schema**: Complete with customers, subscriptions, and orders tables
- **Payment flows**: Checkout sessions, subscription management, and order tracking

**Available Plans:**
- 🏢 **Enterprise Plan** - $199/month subscription with advanced features
- ⚡ **Premium Plan** - $79 one-time payment for individuals  
- 💝 **Support Options** - $5-$25 one-time payments to support development

**How to test payments:**
1. Click the "Pricing & Plans" button in the toolbar
2. Select any plan and click "Subscribe" or "Purchase"
3. Use Stripe test cards (e.g., `4242 4242 4242 4242`) for testing
4. Check the user profile to see subscription status

**Webhook endpoints:**
- Checkout: `https://rcyodojklxpyfjepqqqw.supabase.co/functions/v1/stripe-checkout`
- Webhook: `https://rcyodojklxpyfjepqqqw.supabase.co/functions/v1/stripe-webhook`

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── CodeEditor.tsx  # Main code editor
│   ├── Terminal.tsx    # Integrated terminal
│   └── ...
├── lib/                # Utility libraries
│   └── supabase.ts     # Supabase client
├── stripe-config.ts    # Stripe configuration
└── main.tsx           # Application entry point

supabase/
├── functions/          # Edge functions
│   ├── stripe-checkout/
│   └── stripe-webhook/
└── migrations/         # Database migrations
```

### Adding New Features

1. Create components in `src/components/`
2. Add database changes in `supabase/migrations/`
3. Update environment variables if needed
4. Test thoroughly before deployment

## Deployment

### Production Build

```bash
npm run build
```

### Environment Setup

1. Copy `.env.production` to `.env` for production
2. Update all environment variables with production values
3. Deploy to your preferred hosting platform

### Recommended Hosting

- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **Backend**: Supabase (handles database, auth, and edge functions)
- **Payments**: Stripe

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@rustyclint.com
- 💬 Discord: [Join our community](https://discord.gg/rustyclint)
- 📖 Documentation: [docs.rustyclint.com](https://docs.rustyclint.com)

## Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Powered by [Supabase](https://supabase.com/)
- Payments by [Stripe](https://stripe.com/)
- Icons by [Lucide](https://lucide.dev/)