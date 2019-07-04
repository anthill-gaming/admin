from anthill.platform.remote_models import remote_model_factory

__all__ = ['Voting', 'VotingMember']


Voting = remote_model_factory('vote.Voting')
VotingMember = remote_model_factory('vote.VotingMember')
