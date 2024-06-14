import Serializer, { field } from '../serializer';
import { User } from '../../../../app/moviesFreak/entities';
const UserSerializer = Serializer
    .init(User)
    .addSchema(field('id'), field('name'), field('username'), field('email'), field('birthdate'), field('last_name', { from: 'lastName' }), field('created_at', { from: 'createdAt' }), field('updated_at', { from: 'updatedAt' }));
export default UserSerializer;
//# sourceMappingURL=user.js.map