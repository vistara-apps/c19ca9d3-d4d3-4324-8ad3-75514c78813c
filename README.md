# NutriGenius - Base Mini App

Your personalized daily food guide for health & goals. Get instant, AI-powered meal recommendations tailored to your dietary restrictions and health objectives.

## Features

- **🎯 Personalized Meal Suggestions**: AI-powered recommendations based on your health goals and preferences
- **🚫 Dietary Restriction Filtering**: Automatic filtering for allergies, dietary preferences, and restrictions
- **📊 Nutrient Goal Alignment**: Track your daily nutrition against personalized targets
- **📱 Base Mini App**: Seamlessly integrated with Base wallet and Farcaster
- **🎨 Beautiful UI**: Modern, responsive design with dark theme and smooth animations

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Blockchain**: Base (via OnchainKit and MiniKit)
- **AI**: OpenAI GPT for meal generation and nutrition insights
- **Charts**: Recharts for nutrition visualization
- **Icons**: Lucide React

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nutrigenius-base-miniapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys:
   - `OPENAI_API_KEY` or `OPENROUTER_API_KEY` for AI meal generation
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY` for Base integration

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main dashboard page
│   ├── providers.tsx      # MiniKit and other providers
│   └── globals.css        # Global styles and Tailwind
├── components/            # Reusable UI components
│   ├── AppShell.tsx       # Main app layout
│   ├── MealCard.tsx       # Meal suggestion cards
│   ├── OnboardingFlow.tsx # User preference setup
│   └── ...
├── lib/                   # Utilities and types
│   ├── ai.ts             # OpenAI integration
│   ├── types.ts          # TypeScript interfaces
│   ├── utils.ts          # Helper functions
│   └── constants.ts      # App constants
└── public/               # Static assets
```

## Key Components

### OnboardingFlow
Guides new users through setting up their health goals, dietary restrictions, allergies, and cooking preferences.

### MealCard
Displays AI-generated meal suggestions with nutrition info, ingredients, and user feedback options.

### DashboardStats
Shows daily nutrition progress with visual indicators and goal tracking.

### NutritionChart
Interactive charts for visualizing nutrition data using Recharts.

## AI Integration

The app uses OpenAI's GPT models to generate personalized meal suggestions based on:
- Health goals (weight loss, muscle building, etc.)
- Dietary restrictions (vegetarian, keto, gluten-free, etc.)
- Allergies and food intolerances
- Cuisine preferences
- Cooking skill level and time availability
- Budget constraints

## Base Mini App Features

- **MiniKit Integration**: Seamless wallet connection and frame interactions
- **Farcaster Compatible**: Works within Farcaster frames
- **OnchainKit Components**: Uses official Coinbase components for identity and wallet
- **Mobile Optimized**: Responsive design for mobile-first experience

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for meal generation | Yes* |
| `OPENROUTER_API_KEY` | Alternative to OpenAI API | Yes* |
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | OnchainKit API key for Base | Yes |

*Either OpenAI or OpenRouter API key is required

## Deployment

The app is optimized for deployment on Vercel:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue on GitHub or contact the development team.
