"use client";

import Navbar from "@/app/components/Navbar";
import usePlayers from "@/app/hooks/usePlayers";
import {
  Button,
  Input,
  Table,
  Space,
  ConfigProvider,
  ColorPicker,
  message,
} from "antd";
import type { TableProps } from "antd";
import { useEffect, useState } from "react";

interface DataType {
  playerId: number | null;
  name: string;
}

const PlayersPage = () => {
  const { players, newPlayer, setNewPlayer, AddPlayer, RemovePlayer } =
    usePlayers();

  const [regularPlayers, setPlayers] = useState([]);

  useEffect(() => {
    fetch("/pages/api/players")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Hiba:", err));
  }, []);

  const [messageApi, contextHolder] = message.useMessage();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="text-white">{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            className="text-red-400 hover:text-red-500"
            onClick={() => {
              RemovePlayer(record.name);
              messageApi.success("Player deleted");
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgBase: "#1f2937",
          colorTextBase: "#f9fafb",
          colorBorder: "#374151",
          colorText: "white",
          colorPrimary: "var(--color-primary)",
          colorPrimaryBorder: "var(--color-primary)",
          colorBgContainer: "var(--color-background-light)",
          colorTextPlaceholder: "var(--color-placeholder)",
          colorPrimaryHover: "",
        },
        components: {
          Table: {
            headerBg: "#374151",
            headerColor: "#f9fafb",
            borderColor: "#4b5563",
            colorBgContainer: "#1f2937",
          },
          Input: {
            colorBgContainer: "#374151",
            colorText: "#f9fafb",
            colorBorder: "#4b5563",
          },
          Button: {
            colorPrimary: "#10b981",
            colorText: "#f9fafb",
          },
        },
      }}
    >
      <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-black p-4">
        <Navbar />

        <div className="mt-6 max-w-md mx-auto space-y-4">
          <h2 className="text-xl font-semibold text-white">Add new player</h2>
          <Input
            value={newPlayer}
            placeholder="Player name"
            onChange={(e) => setNewPlayer(e.target.value)}
          />
          <Button type="primary" className="mt-2 w-full" onClick={AddPlayer}>
            Add Player
          </Button>
        </div>

        <div className="mt-10 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-4">
            Manage players
          </h2>
          <Table<DataType>
            columns={columns}
            dataSource={players}
            pagination={false}
            rowKey={(record) => record.playerId ?? ""}
            bordered
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default PlayersPage;
