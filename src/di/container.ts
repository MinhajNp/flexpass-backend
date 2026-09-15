import { OtpRepository } from '../repositories/otpRepository.js';
import { UserRepository } from '../repositories/userRepository.js';
import { OtpService } from '../services/otpService.js';
import { AuthService } from '../services/authService.js';
import { AuthController } from '../controllers/authController.js';

// ==============================
// REPOSITORIES
// ==============================

const userRepository = new UserRepository();
const otpRepository = new OtpRepository();

// ==============================
// SERVICES
// ==============================

const otpService = new OtpService(otpRepository, userRepository);

const authService = new AuthService(userRepository, otpService);

// ==============================
// CONTROLLERS
// ==============================

export const authController = new AuthController(authService, otpService);
