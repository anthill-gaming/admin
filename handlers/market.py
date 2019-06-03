from ._base import ServicePageHandler, ServiceFormHandler
from anthill.framework.handlers.edit import FormMixin, ProcessFormMixin


class MarketPageHandler(ServicePageHandler):
    service_name = 'market'


class MarketFormHandler(FormMixin, ProcessFormMixin, MarketPageHandler):
    pass


class IndexHandler(MarketPageHandler):
    page_name = 'index'

    async def get_context_data(self, **kwargs):
        context = await super().get_context_data(**kwargs)
        return context
