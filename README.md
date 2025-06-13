# PVP Lens - World of Warcraft PVP Statistics Tracker

A modern Next.js application for tracking and analyzing World of Warcraft PVP statistics with a fantasy-themed UI inspired by WoW's art style.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)
![React Query](https://img.shields.io/badge/React%20Query-ff4154?style=flat-square&logo=react-query)

## ✨ Features

- **🔍 Character Search**: Look up World of Warcraft characters by name and realm
- **📊 PVP Statistics**: View detailed arena and battleground ratings
- **🏆 Performance Analytics**: Win rates, match history, and season progression
- **🎨 Fantasy UI**: Dark theme with WoW-inspired colors and animations
- **📱 Responsive Design**: Optimized for desktop and mobile devices
- **⚡ Real-time Data**: Live statistics from Blizzard's API
- **🌍 Multi-Region Support**: Support for US, EU, KR, and TW regions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Blizzard API credentials (Client ID & Client Secret)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pvplens.git
   cd pvplens
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Blizzard API credentials:
   ```env
   NEXT_PUBLIC_BLIZZARD_CLIENT_ID=your_client_id_here
   NEXT_PUBLIC_BLIZZARD_CLIENT_SECRET=your_client_secret_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Blizzard API Setup

1. Visit the [Blizzard Developer Portal](https://develop.battle.net/)
2. Create a new application
3. Note down your Client ID and Client Secret
4. Add them to your `.env.local` file

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_BLIZZARD_CLIENT_ID` | Blizzard API Client ID | Yes |
| `NEXT_PUBLIC_BLIZZARD_CLIENT_SECRET` | Blizzard API Client Secret | Yes |
| `NEXT_PUBLIC_BLIZZARD_API_BASE_URL` | Blizzard API Base URL | No (defaults to US) |
| `NEXT_PUBLIC_DEFAULT_REGION` | Default region for searches | No (defaults to 'us') |

## 🏗️ Project Structure

```
pvplens/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   └── loading.tsx
│   │   ├── features/          # Feature-specific components
│   │   │   ├── character-search.tsx
│   │   │   └── character-profile.tsx
│   │   └── providers/         # React context providers
│   │       └── query-provider.tsx
│   ├── services/              # API service classes
│   │   ├── blizzard-api.service.ts
│   │   └── character.service.ts
│   ├── hooks/                 # Custom React hooks
│   │   ├── useCharacter.ts
│   │   └── index.ts
│   ├── types/                 # TypeScript definitions
│   │   ├── wow.ts
│   │   └── index.ts
│   └── utils/                 # Utility functions
│       └── index.ts
├── public/                    # Static assets
├── tailwind.config.js         # Tailwind CSS configuration
├── package.json
└── README.md
```

## 🎨 Design System

### Theme Colors

- **Primary**: Blue gradient (#6366f1 to #4f46e5)
- **Secondary**: Purple gradient (#d946ef to #c026d3)
- **WoW-specific**: Alliance blue (#0078FF), Horde red (#DC143C)
- **Rating tiers**: Gladiator purple, Elite orange, Duelist blue, etc.

### Components

- **Glass morphism effects** with backdrop blur
- **Animated hover states** with smooth transitions
- **Responsive grid layouts** for different screen sizes
- **Custom scrollbars** and loading states

## 📚 API Integration

### Blizzard API Services

The application uses a service-oriented architecture for API integration:

- **BlizzardApiService**: Base service with authentication and error handling
- **CharacterService**: Character-specific API endpoints
- **Caching**: React Query for intelligent data caching and synchronization

### Supported Endpoints

- Character profile data
- PVP summary and bracket statistics
- Character media (avatars, renders)
- Equipment and achievements
- Realm and region information

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- **TypeScript** for type safety
- **ESLint** with Next.js configuration
- **Prettier** for code formatting
- **Conventional commits** for commit messages

### Component Development

Components follow these principles:
- **Composition over inheritance**
- **Props interface definitions**
- **Consistent naming conventions**
- **Accessibility best practices**

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Add environment variables** in the Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

PVP Lens is not affiliated with Blizzard Entertainment. World of Warcraft is a trademark of Blizzard Entertainment, Inc.

## 🙏 Acknowledgments

- [Blizzard Entertainment](https://www.blizzard.com/) for providing the API
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React Query](https://tanstack.com/query) for data fetching and caching
- The World of Warcraft community for inspiration

---

**Built with ❤️ for the WoW PVP community**
