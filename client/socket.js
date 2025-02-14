import { ClientEvents } from "../common/socket/client-events.js";
import { ServerEvents } from "../common/socket/server-events.js";

const socket = new io("http://localhost:7042", {
	path: "/bomberman.io"
});

export function socketConnected() {
	return new rxjs.Observable(observer => {
		socket.on("connect", function() {
			observer.next();
		});
	});
}


/**
 * Request server for a new session id. The session will be provided after the socket will connect.
 * @returns Promise<sessionId: string>
 */
export function requestUserIdentity() {
	return new rxjs.Observable(observer => {
		socket.on(ServerEvents.SEND_USER_IDENTITY, (userIdentityId) => observer.next(userIdentityId));
	});
}

export function joinGame(nickname) {
	return new Promise((resolve, reject) => {
		socket.emit(ClientEvents.JOIN_GAME, nickname, () => {
			resolve();
		});
	});
}

export function joinLobby(nickname) {
	return new Promise((resolve, reject) => {
		socket.emit(ClientEvents.JOIN_LOBBY, nickname, () => {
			resolve();
		});
	});
}

export function onUserJoindGame() {
	return new rxjs.Observable(observer => {
		socket.on(ServerEvents.USER_JOINED, (player) => {
			observer.next(player);
		})
	})
}

export function onUserJoindLobby() {
	return new rxjs.Observable(observer => {
		socket.on(ServerEvents.USER_JOINED_LOBBY, (player) => {
			observer.next(player);
		})
	})
}

export function sendPlayerUpdate(dx, dy, fire, reload) {
	return new Promise((resolve, reject) => {
		socket.emit(ClientEvents.PLAYER_UPDATE, { dx, dy, fire, reload }, () => {
			resolve();
		});
	});
}

export function onPlayerUpdated() {
	return new rxjs.Observable(observer => {
		socket.on(ServerEvents.PLAYER_UPDATED, (updateInfo) => {
			observer.next(updateInfo);
		})
	})
}

export function sendGo() {
	return new Promise((resolve, reject) => {
		socket.emit("go", "", () => {
			resolve();
		});
	});
}


export function goPlayer() {
	return new rxjs.Observable(observer => {
		socket.on("go-player", (updateInfo) => {
			observer.next();
		})
	})
}

export function getUsersFromLobby() {
	return new Promise((resolve, reject) => {
		socket.emit(ClientEvents.GET_USERS_FROM_LOBBY, "", (players) => {
			resolve(players);
		});
	});
}

export function onUserDisconnected() {
	return new rxjs.Observable(observer => {
		socket.on(ServerEvents.PLAYER_DISCONNECTED, (userIdentityId) => {
			observer.next(userIdentityId);
		});
	});
}

export function sendPlayerReady() {
	return new Promise((resolve, reject) => {
		socket.emit(ClientEvents.PLAYER_READY, "", () => {
			resolve();
		});
	});
}

export function onPlayerReady() {
	return new rxjs.Observable(observer => {
		socket.on(ServerEvents.PLAYER_READY, (userIdentityId) => {
			observer.next(userIdentityId);
		});
	});
}

/** @param {{event: "key-pressed" | "key-released", key: string}} event */
export function sendPlayerKeyEvent(event) {
	// TODO send the event to the server which will broadcast back to all other players in order for them to move their representation of our player
	console.log("TODO implement this")
}

export function sendPlayerSpanwed(playerSlot) {
	// TODO send an event to the server which will broadcast to all other players, letting them instantiate dummy player objects representing our player
	// the other players will receive the onNetworkPlayerSpawned(slotId) event
	console.log("TODO implement this too");
}

/**
 * emits the slot id when another player is spawned
 * @returns {rxjs.Observable}
 **/
export function onNetworkPlayerSpawned() {
	return new rxjs.Observable(observer => {
		// TODO listen to server....
		const networkPlayerSlot = 1; // this will be received from the server
		observer.next(networkPlayerSlot);
	});
}

/**
 * emits the input event {playerId: number, key: string, status: boolean} when another player presses/releases a key
 * @returns {rxjs.Observable}
 **/
export function onNetworkPlayerInput() {
	return new rxjs.Observable(observer => {
		// TODO listen to server...
		const event = {playerId: 1, key: "ArrowLeft", status: true}; // this will be received from the server
		observer.next(event);
	});
}
