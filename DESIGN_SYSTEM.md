# 🎨 Swisstination Design System

## Theme: Serene Tourism with Cloud Aesthetics

### 🌤️ Visual Identity
- **Concept**: Peaceful, cloud-themed tourism experience
- **Mood**: Cool, comfy, and serene
- **Target**: Travel and tourism applications

### 🎨 Color Palette
```css
/* Primary Sky Colors */
--sky-100: #B3E5FC    /* Light sky blue */
--sky-200: #81D4FA    /* Medium sky blue */

/* Glassmorphism Effects */
--glass-bg: rgba(255, 255, 255, 0.2)
--glass-border: rgba(255, 255, 255, 0.3)
--glass-backdrop: backdrop-blur-xl
```

### 📝 Typography
- **Primary Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Usage**: All text elements use Inter font family

### 🌟 Component Styles

#### Glassmorphism Cards
```jsx
className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-8"
```

#### Input Fields
```jsx
className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200"
```

#### Gradient Buttons
```jsx
className="bg-gradient-to-r from-sky-400 to-teal-400 text-white font-medium rounded-lg hover:from-sky-500 hover:to-teal-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
```

### 🎬 Animations

#### Cloud Float Animation
```css
@keyframes float {
  0%, 100% { transform: translateX(-20px) translateY(0px) }
  50% { transform: translateX(20px) translateY(-20px) }
}

/* Animation Classes */
.animate-float         /* 20s duration */
.animate-float-delayed /* 25s duration, 5s delay */
.animate-float-slow    /* 30s duration, 10s delay */
```

### 🧩 Components

#### CloudBackground
- **Purpose**: Animated cloud background with gradient sky
- **Features**: 6 floating SVG clouds with different animations
- **Usage**: Import and place as background in any page

#### Login Page
- **Layout**: Fullscreen cloud background with centered glass card
- **Fields**: Email, Password, Remember Me checkbox
- **Features**: Form validation, loading states, error handling

#### Signup Page
- **Layout**: Matching cloud background with centered glass card
- **Fields**: Name, Email, Password, Confirm Password
- **Features**: Client-side validation, password matching, error display

### 🚀 Usage

1. **Install Dependencies**:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

### 📱 Responsive Design
- **Mobile First**: All components designed mobile-first
- **Breakpoints**: Uses Tailwind's default responsive breakpoints
- **Touch Friendly**: Button sizes optimized for touch interaction

### ♿ Accessibility
- **Focus States**: Visible focus rings on all interactive elements
- **Color Contrast**: High contrast text on glass backgrounds
- **Screen Readers**: Proper labels and ARIA attributes
- **Keyboard Navigation**: Full keyboard accessibility

### 🔧 Customization
The design system is built with Tailwind CSS utility classes, making it easy to:
- Adjust colors in `tailwind.config.js`
- Modify animations and transitions
- Add new components following the established patterns
- Maintain consistency across the application
