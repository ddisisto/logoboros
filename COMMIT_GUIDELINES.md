# Commit Guidelines for Logoboros

## Overview

This document outlines simple guidelines for commit messages and task management in the Logoboros project. Rather than implementing complex automated systems in this early development phase, we'll follow these principles manually.

## Basic Principles

1. **Task Tracking → Implementation → Commits**: Follow a clear workflow from task creation to implementation to commit
2. **Descriptive Commit Messages**: Write clear, concise messages that explain *what* and *why*
3. **Reference Tasks**: Include task references in commit messages when applicable

## Commit Message Format

```
<type>: <description>

[optional body]

Refs: #<task-number> or task description
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc; no code change
- `refactor`: Code restructuring without changing external behavior
- `test`: Adding or updating tests
- `chore`: Updating build tasks, package manager configs, etc.
- `perf`: Performance improvements
- `ui`: UI/UX improvements

### Examples

```
feat: Implement meta-dashboard with budget tracking

Add real-time budget visualization and connection status indicator
for Claude metrics integration.

Refs: Integrate Claude metrics with game mechanics
```

```
fix: Correct resource calculation for token count metrics

Refs: Resource generation balance
```

## Task Management

1. **Create Tasks Before Coding**: Document tasks in USER_INPUT.md before implementation
2. **Update Task Status**: Mark tasks as in-progress, complete, or cancelled as work proceeds
3. **Group Related Tasks**: Keep related tasks together to assist with meaningful commits
4. **Prioritize Tasks**: Use high/medium/low priorities to guide implementation order

## Self-Improving System Concepts

The game's theme of recursive self-improvement is reflected in our development process:

1. **Planning Feedback Loop**: Tasks inform commits, which inform new tasks
2. **Resource Generation**: Development activities generate in-game resources
3. **Singularity Events**: Major milestones trigger "singularities" in development
4. **Character Roles**: Different roles (Visionary, Engineer, etc.) have different approaches

## Implementation in Codebase

These principles will be implemented in a lightweight manner within our codebase:

1. User requests → USER_INPUT.md task tracking
2. Task completion → Well-structured commits
3. Development activities → Meta-game resource generation
4. Major feature completion → Singularity events

By following these guidelines rather than enforcing them through complex code, we maintain agility while still capturing the essence of our self-improving system theme.