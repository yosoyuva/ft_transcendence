# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: adelille <adelille@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/09/16 14:32:39 by adelille          #+#    #+#              #
#    Updated: 2022/09/16 14:32:42 by adelille         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME =	ft_transcendence

FRONT =	./frontend
BACK =	./backend

ENV =			.env
SECRETENV =		.front.env
HOSTNAMEENV =	.hostname.env

# **************************************************************************** #
#	MAKEFILE	#

SHELL := bash

B =		$(shell tput bold)
RED =	$(shell tput setaf 1)
GRE =	$(shell tput setaf 2)
YEL =	$(shell tput setaf 3)
D =		$(shell tput sgr0)

# *************************************************************************** #
#	RULES	#

all:	$(NAME)

$(NAME):	stop
	@[ -f $(SECRETENV) ] || echo -e "$(B)$(YEL)[WARNING]$(D)\t$(SECRETENV) not found"
	docker-compose up --force-recreate --build || exit 0

ip:
	@hostname -I | cut -d' ' -f1

hostname:
	@echo "REACT_APP_SERVER_HOSTNAME=$(shell hostname)" > .hostname.env
	@echo "Website address : http://$$(hostname):3001/"

db:
	docker-compose run -p 5432:5432 db

back:	hostname
	([ -d $(BACK)/node_modules ] || npm --prefix $(BACK) install $(BACK) --legacy-peer-deps) && exit 0
	@export PORT=3000 DATABASE_HOST=localhost DATABASE_PORT=5432 $(shell sed -e 's/ *#.*$$//' ./$(HOSTNAMEENV)) $(shell sed -e 's/ *#.*$$//' ./$(ENV))	\
	&& npm --prefix $(BACK) run start:dev

front:	hostname
	([ -d $(FRONT)/node_modules ] || npm --prefix $(FRONT) install $(FRONT) --legacy-peer-deps) && exit 0
	@export PORT=3001 $(shell sed -e 's/ *#.*$$//' ./$(HOSTNAMEENV)) $(shell sed -e 's/ *#.*$$//' ./$(SECRETENV))	\
	&& npm --prefix $(FRONT) start

stop:	hostname
	killall -eqv -SIGINT node || exit 0
	docker-compose down

dev:	stop
	xterm -e $(MAKE) db &
	xterm -e $(MAKE) back &
	xterm -e $(MAKE) front &

clean:	stop
	docker system prune --volumes -f

fclean: clean
	docker system prune -af

re:		clean all

fre:	fclean all

list:
	@printf "\n\t$(B)$(GRE)containers$(D)\n"
	@docker ps -a
	@printf "\n\t$(B)$(GRE)images$(D)\n"
	@docker images -a
	@printf "\n\t$(B)$(GRE)networks$(D)\n"
	@docker network ls
	@printf "\n\t$(B)$(GRE)volumes$(D)\n"
	@docker volume ls
	@echo ;

.PHONY: all ip hostname db back front stop dev clean fclean re fre list

# **************************************************************************** #
