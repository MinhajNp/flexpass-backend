import { AuthController } from '../controllers/authController.js';
import { UserRepository } from '../repositories/userRepository.js';
import { AuthService } from '../services/authService.js';

// auth
const userRepository = new UserRepository();

const authService = new AuthService(userRepository);

const authController = new AuthController(authService);

export { authController };
