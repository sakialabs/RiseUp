# Contributing to RiseUp Collective

Thank you for your interest in contributing to RiseUp Collective! This project exists to help people organize locally and take real action together.

---

## Code of Conduct

### Our Values

- **Love** - Care in action. Be kind and respectful
- **Solidarity** - We move together. Support each other
- **Empowerment** - Everyone has something to offer

### Guidelines

- Be respectful and constructive
- Welcome newcomers
- Focus on the work, not ego
- No harassment or discrimination
- Keep discussions grounded in action

---

## How to Contribute

### 1. Pick an Area

- **Backend** - Python/FastAPI development
- **Web Frontend** - Next.js/React/TypeScript
- **Mobile** - React Native/Expo
- **Documentation** - Writing and clarity
- **Design** - UI/UX improvements
- **Testing** - Quality assurance

### 2. Find Something to Work On

- Check `docs/tasks.md` for implementation roadmap
- Look at GitHub Issues
- Check `docs/PROJECT_STATUS.md` for "What's Next"
- Propose new features (keep them simple and action-oriented)

### 3. Set Up Your Environment

Follow `SETUP.md` to get the project running locally.

### 4. Make Your Changes

- Create a new branch: `git checkout -b feature/your-feature-name`
- Make focused, incremental changes
- Write clear commit messages
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 5. Submit a Pull Request

- Push your branch to GitHub
- Open a Pull Request
- Describe what you changed and why
- Reference any related issues
- Be patient and open to feedback

---

## Development Guidelines

### Code Style

**Python (Backend)**

- Follow PEP 8
- Use type hints
- Write docstrings for functions
- Keep functions focused and small

**TypeScript (Web/Mobile)**

- Use TypeScript, not JavaScript
- Define proper types/interfaces
- Use functional components
- Keep components focused

### Writing

Follow `docs/tone.md`:

- Human first, not corporate
- Simple words over fancy ones
- Action-oriented, not performative
- Grounded in real life

### Design

Follow `docs/styles.md`:

- Use defined color palette
- No gradients or neon colors
- High contrast for readability
- Mobile-first approach

### Testing

- Write tests for new features
- Ensure existing tests pass
- Test on mobile devices
- Test with real data

---

## Project Structure

```
RiseUp/
├── backend/      # FastAPI backend
├── web/          # Next.js web app
├── mobile/       # React Native app
└── docs/         # Documentation
```

See `docs/design.md` for architecture details.

---

## Commit Message Format

```
<type>: <short description>

<optional longer description>

<optional footer>
```

**Types:**

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**

```
feat: add event search functionality

fix: resolve authentication token expiration issue

docs: update setup guide with Docker instructions
```

---

## Pull Request Guidelines

### Good PRs

- ✅ Focused on one thing
- ✅ Include tests
- ✅ Update documentation
- ✅ Clear description
- ✅ Reference related issues

### What to Avoid

- ❌ Massive changes touching many files
- ❌ Mixing unrelated changes
- ❌ Breaking existing functionality
- ❌ No tests or documentation
- ❌ Vague descriptions

---

## Testing Your Changes

### Backend

```bash
cd backend
pytest
```

### Web

```bash
cd web
npm run lint
npm run build  # Ensure it builds
```

### Mobile

```bash
cd mobile
npm start
# Test on actual device
```

---

## Documentation

Update these when relevant:

- `CHANGELOG.md` - Add your changes
- `docs/PROJECT_STATUS.md` - Update implementation status
- `QUICK_REFERENCE.md` - Add new commands/APIs
- Code comments - Explain complex logic
- README files - Keep them current

---

## Questions?

- Read the documentation in `docs/`
- Check `QUICK_REFERENCE.md` for common tasks
- Look at existing code for examples
- Ask in GitHub Discussions
- Open an issue for bugs or feature requests

---

## What We're Looking For

### High Priority

- Tests for existing features
- Frontend pages (registration, login, feed, events, map)
- Mobile app screens
- Documentation improvements
- Bug fixes

### Medium Priority

- UI components library
- Search and filtering
- Image upload
- Notifications
- Performance improvements

### Lower Priority

- Advanced features
- Nice-to-haves
- Experimental ideas

See `docs/PROJECT_STATUS.md` for detailed priorities.

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

## Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes (for significant contributions)
- Project documentation (for major features)

---

## Remember

This platform exists to help people take care of each other and organize for change.

Every contribution—big or small—helps make that happen.

**Thank you for being part of this.**
