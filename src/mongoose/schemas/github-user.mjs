import mongoose from 'mongoose';

const githubUserSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  githubId: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  publicRepos: {
    type: mongoose.Schema.Types.Number,
  },
});

export const GitHubUser = mongoose.model('GitHubUser', githubUserSchema);
