from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()
hash = bcrypt.generate_password_hash("321dorwssaP")

print(hash)