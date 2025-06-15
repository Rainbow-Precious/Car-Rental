# Car Rental Application

A modern web application for managing car rentals, built with React, TypeScript, and Material-UI.

## Features

- User authentication and authorization
- Car management system
- Customer management
- Booking management
- Responsive design
- Modern UI with Material-UI components

## Tech Stack

- React 18
- TypeScript
- Material-UI
- React Router
- React Hot Toast
- Vite

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/car-rental-app.git
cd car-rental-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── AdminDashboard/
│   │   ├── CarManagement.tsx
│   │   ├── CustomerManagement.tsx
│   │   └── BookingManagement.tsx
│   ├── CustomerDashboard/
│   │   └── CustomerDashboard.tsx
│   └── Navigation/
│       └── Navigation.tsx
├── pages/
│   └── Home/
│       └── Home.tsx
├── Routes/
│   └── route.tsx
├── theme.ts
├── App.tsx
└── main.tsx
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
