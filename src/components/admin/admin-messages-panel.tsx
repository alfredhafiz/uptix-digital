"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminChatInterface } from "@/components/admin/admin-chat-interface";
import { Search, MessageSquare, Clock } from "lucide-react";

interface Client {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  messages: Array<{
    id: string;
    content: string;
    createdAt: Date;
  }>;
}

interface AdminMessagesPanelProps {
  initialClients: Client[];
}

function getClientAvatarUrl(client: any): string {
  // If client has a profile image, use it
  if (client.image) {
    return client.image;
  }
  // Otherwise generate a DiceBear avatar based on their name or email
  const seed = client.name || client.email;
  return `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4`;
}

function getTimeSinceLastMessage(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function AdminMessagesPanel({
  initialClients,
}: AdminMessagesPanelProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState(initialClients);

  // Compute online status directly instead of in an effect
  const onlineStatus: Record<string, boolean> = {};
  clients.forEach((client) => {
    const lastMessageTime = client.messages[0]?.createdAt;
    if (lastMessageTime) {
      const timeDiff =
        new Date().getTime() - new Date(lastMessageTime).getTime();
      onlineStatus[client.id] = timeDiff < 5 * 60 * 1000; // 5 minutes
    }
  });

  const filteredClients = clients.filter(
    (c) =>
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Clients List */}
      <Card className="glass-card border-white/10 lg:col-span-1">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-base">Clients</CardTitle>
          <div className="mt-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass border-white/10 bg-white/5 text-white pl-8 h-8 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <ScrollArea className="h-[480px]">
          <CardContent className="space-y-2">
            {filteredClients.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">
                No clients found
              </p>
            ) : (
              filteredClients.map((client) => {
                const lastMessage = client.messages[0];
                const isSelected = selectedClientId === client.id;
                const isOnline = onlineStatus[client.id] || false;
                const avatarUrl = getClientAvatarUrl(client);

                return (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-blue-500/20 border border-blue-500/50"
                        : "bg-white/5 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar with Online Indicator */}
                      <div className="relative flex-shrink-0">
                        <Image
                          src={avatarUrl}
                          alt={client.name || client.email}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                          sizes="40px"
                          unoptimized={avatarUrl.includes("dicebear.com")}
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-slate-900 ${
                            isOnline ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        />
                      </div>

                      {/* Client Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-white text-sm font-medium truncate">
                            {client.name || "No Name"}
                          </p>
                          {isOnline && (
                            <span className="text-green-400 text-xs bg-green-500/20 px-1.5 py-0.5 rounded-full">
                              online
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs truncate">
                          {client.email}
                        </p>
                        {lastMessage && (
                          <p className="text-slate-500 text-xs mt-1 line-clamp-1">
                            {lastMessage.content}
                          </p>
                        )}
                        {lastMessage && (
                          <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {getTimeSinceLastMessage(lastMessage.createdAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </CardContent>
        </ScrollArea>
      </Card>

      {/* Chat Interface */}
      {selectedClient ? (
        <Card className="glass-card border-white/10 lg:col-span-3">
          <CardHeader className="pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={getClientAvatarUrl(selectedClient)}
                  alt={selectedClient.name || selectedClient.email}
                  width={44}
                  height={44}
                  className="rounded-full object-cover"
                  sizes="44px"
                  unoptimized={getClientAvatarUrl(selectedClient).includes(
                    "dicebear.com",
                  )}
                />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                    onlineStatus[selectedClient.id]
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                />
              </div>
              <div>
                <CardTitle className="text-white text-base">
                  {selectedClient.name || "Client"}
                </CardTitle>
                <p className="text-slate-400 text-xs">
                  {onlineStatus[selectedClient.id]
                    ? "Online now"
                    : `Last seen ${getTimeSinceLastMessage(
                        selectedClient.messages[0]?.createdAt ||
                          selectedClient.createdAt,
                      )}`}
                </p>
              </div>
            </div>
          </CardHeader>
          <AdminChatInterface
            clientId={selectedClient.id}
            clientName={selectedClient.name || "Client"}
          />
        </Card>
      ) : (
        <Card className="glass-card border-white/10 lg:col-span-3 flex items-center justify-center">
          <MessageSquare className="w-12 h-12 text-slate-500" />
          <p className="text-slate-400 ml-3">
            Select a client to start messaging
          </p>
        </Card>
      )}
    </div>
  );
}
