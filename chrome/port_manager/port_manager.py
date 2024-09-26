from typing import Optional

STARTING_PORT = 9222


class PortManager:
    def __init__(self, max_connections: int):
        self.max_connections = max_connections
        self.ports = {
            i: False for i in range(STARTING_PORT, STARTING_PORT + max_connections)
        }

    def get_available_port(self) -> Optional[int]:
        for port, is_used in self.ports.items():
            if not is_used:
                return port
        return None

    def mark_port_as_used(self, port: int):
        self.ports[port] = True

    def mark_port_as_available(self, port: int):
        self.ports[port] = False
