from anthill.platform.remote_models import remote_model_factory


__all__ = ['Market', 'MarketSeller', 'MarketItem', 'MarketOrder']


Market = remote_model_factory('market.Market')
MarketSeller = remote_model_factory('market.Seller')
MarketItem = remote_model_factory('market.Item')
MarketOrder = remote_model_factory('market.Order')
