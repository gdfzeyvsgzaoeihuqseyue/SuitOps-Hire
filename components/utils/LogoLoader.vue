<template>
  <div 
    class="logo-loader-inline" 
    :class="[
      { 'fullscreen': fullscreen },
      `size-${size}`
    ]"
  >
    <div class="logo-wrapper">
      <svg 
        viewBox="0 0 1080 1080" 
        xmlns="http://www.w3.org/2000/svg"
        class="animated-logo"
      >
        <!-- V gauche (Orange) -->
        <path 
          class="v-left-orange"
          d="M 120 50 L 300 200 L 300 900 L 120 1030 Z"
          fill="#F26522"
        />
        
        <!-- V gauche (Bleu marine) -->
        <path 
          class="v-left-blue"
          d="M 120 300 L 420 500 L 420 900 L 120 1030 Z"
          fill="#1E1B5E"
        />
        
        <!-- V droite (Orange) -->
        <path 
          class="v-right-orange"
          d="M 960 50 L 780 200 L 780 900 L 960 1030 Z"
          fill="#F26522"
        />
        
        <!-- V droite (Bleu marine) -->
        <path 
          class="v-right-blue"
          d="M 960 300 L 660 500 L 660 900 L 960 1030 Z"
          fill="#1E1B5E"
        />
        
        <!-- Poignée de main (simplifiée) -->
        <g class="handshake">
          <!-- Main gauche (beige) -->
          <path 
            d="M 420 580 L 480 620 L 500 640 L 520 660 L 540 650 L 540 580 L 480 540 L 420 540 Z"
            fill="#D4A574"
          />
          <!-- Main droite (marron) -->
          <path 
            d="M 660 580 L 600 620 L 580 640 L 560 660 L 540 650 L 540 580 L 600 540 L 660 540 Z"
            fill="#7B5835"
          />
          <!-- Doigts entrelacés -->
          <ellipse cx="540" cy="640" rx="30" ry="20" fill="#A0856A" />
        </g>
      </svg>
      
      <div class="pulse-ring"></div>
    </div>
    
    <p v-if="showText" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  fullscreen: {
    type: Boolean,
    default: false
  },
  showText: {
    type: Boolean,
    default: true
  },
  text: {
    type: String,
    default: 'Chargement...'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

defineEmits(['loaded'])
</script>

<style scoped>
/* Version inline (par défaut) */
.logo-loader-inline {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  min-height: 200px;
}

/* Version fullscreen (optionnelle) */
.logo-loader-inline.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  z-index: 9999;
  padding: 0;
  min-height: 100vh;
}

.logo-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.animated-logo {
  width: 80px;
  height: 80px;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1));
}

/* Tailles personnalisables */
.logo-loader-inline.size-sm .animated-logo {
  width: 50px;
  height: 50px;
}

.logo-loader-inline.size-sm .pulse-ring {
  width: 50px;
  height: 50px;
}

.logo-loader-inline.size-md .animated-logo {
  width: 80px;
  height: 80px;
}

.logo-loader-inline.size-md .pulse-ring {
  width: 80px;
  height: 80px;
}

.logo-loader-inline.size-lg .animated-logo {
  width: 120px;
  height: 120px;
}

.logo-loader-inline.size-lg .pulse-ring {
  width: 120px;
  height: 120px;
}

.logo-loader-inline.fullscreen .animated-logo {
  width: 200px;
  height: 200px;
}

.logo-loader-inline.fullscreen .pulse-ring {
  width: 200px;
  height: 200px;
  border-width: 3px;
}

/* Animation des V gauches */
.v-left-orange {
  transform-origin: center;
  animation: 
    slideInLeft 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards,
    floatLeft 2s ease-in-out 0.8s infinite;
}

.v-left-blue {
  transform-origin: center;
  animation: 
    slideInLeft 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.1s backwards,
    floatLeft 2s ease-in-out 0.9s infinite;
}

/* Animation des V droites */
.v-right-orange {
  transform-origin: center;
  animation: 
    slideInRight 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s backwards,
    floatRight 2s ease-in-out 1s infinite;
}

.v-right-blue {
  transform-origin: center;
  animation: 
    slideInRight 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s backwards,
    floatRight 2s ease-in-out 1.1s infinite;
}

/* Animation de la poignée de main */
.handshake {
  transform-origin: center;
  animation: 
    fadeInScale 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.4s backwards,
    pulse 2s ease-in-out 1.2s infinite;
}

/* Entrée depuis la gauche */
@keyframes slideInLeft {
  0% {
    transform: translateX(-100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Entrée depuis la droite */
@keyframes slideInRight {
  0% {
    transform: translateX(100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Apparition avec scale */
@keyframes fadeInScale {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Flottement gauche */
@keyframes floatLeft {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-3px);
  }
}

/* Flottement droit */
@keyframes floatRight {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(3px);
  }
}

/* Pulsation */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Anneau de pulsation */
.pulse-ring {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 2px solid #F26522;
  border-radius: 50%;
  opacity: 0;
  animation: pulseRing 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) 0.8s infinite;
}

@keyframes pulseRing {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

/* Texte de chargement */
.loading-text {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  animation: fadeInOut 1.5s ease-in-out infinite;
}

.logo-loader-inline.fullscreen .loading-text {
  font-size: 1.125rem;
  margin-top: 2rem;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}

/* Animation de sortie */
.logo-loader-inline.fade-out {
  animation: fadeOut 0.4s ease-out forwards;
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}
</style>
