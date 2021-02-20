from entities.entity import Entity


class MovieEntity(Entity):
    def __init__(
            self, id=None, title=None, plot=None, watch_on=None, released_at=None,
            created_at=None, updated_at=None
    ):
        super().__init__(id=id, created_at=created_at, updated_at=updated_at)

        self.title = title
        self.plot = plot
        self.watch_on = watch_on
        self.released_at = released_at

    @property
    def as_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'plot': self.plot,
            'watch_on': self.watch_on,
            'released_at': self.released_at,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
