import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const PokerManager = () => {
  const MIN_BI = 7500; // Minimum Buy-in

  const [players, setPlayers] = useState(() => {
    const initialPlayers = [];
    for (let i = 1; i <= 9; i++) {
      initialPlayers.push({
        id: i,
        name: `Người chơi ${i}`,
        initialBI: 0,    // Số chip mua vào ban đầu
        currentChips: 0, // Số chip hiện tại
        allInLosses: 0,  // Số lần thua all-in
        score: 0
      });
    }
    return initialPlayers;
  });

  // Tính điểm cho người chơi
  const calculateScore = (player) => {
    const profit = player.currentChips - player.initialBI;
    
    // Tính điểm trừ do thua all-in (3 điểm mỗi lần)
    const allInPenalty = player.allInLosses * 3;

    if (profit >= 0) {
      // Công thức cho người thắng: 150 × profit/(profit + initialBI)
      return (150 * profit / (profit + player.initialBI)) - allInPenalty;
    } else {
      // Công thức cho người thua: -100 × profit/(profit + initialBI)
      return (-100 * Math.abs(profit) / (Math.abs(profit) + player.initialBI)) - allInPenalty;
    }
  };

  // Cập nhật số lần thua all-in
  const updateAllInLosses = (playerId, change) => {
    setPlayers(prevPlayers => {
      return prevPlayers.map(player => {
        if (player.id === playerId) {
          const newAllInLosses = Math.max(0, player.allInLosses + change);
          const updatedPlayer = {
            ...player,
            allInLosses: newAllInLosses
          };
          updatedPlayer.score = calculateScore(updatedPlayer);
          return updatedPlayer;
        }
        return player;
      });
    });
  };

  // Cập nhật thông tin người chơi
  const updatePlayer = (id, field, value) => {
    setPlayers(prevPlayers => {
      return prevPlayers.map(player => {
        if (player.id === id) {
          // Xử lý đặc biệt cho input số
          let newValue = value;
          if (field === 'initialBI' || field === 'currentChips') {
            // Loại bỏ số 0 ở đầu và chuyển đổi sang số
            newValue = value ? parseInt(value.replace(/^0+/, '')) || 0 : 0;
          } else if (field !== 'name') {
            newValue = parseInt(value) || 0;
          }
  
          const updatedPlayer = {
            ...player,
            [field]: newValue
          };
          updatedPlayer.score = calculateScore(updatedPlayer);
          return updatedPlayer;
        }
        return player;
      });
    });
  };

  // Sắp xếp người chơi theo điểm
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold text-center">
            Quản lý Người chơi Poker
          </h2>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Tên</th>
                  <th className="p-2 text-center">Initial BI</th>
                  <th className="p-2 text-center">Chips hiện tại</th>
                  <th className="p-2 text-center">Profit</th>
                  <th className="p-2 text-center">All-in thua</th>
                  <th className="p-2 text-center">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((player) => (
                  <tr key={player.id} className="border-b">
                    <td className="p-2">
                        <input
                            type="text"
                            value={player.name}
                            onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                            className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tên..."
                        />
                    </td>
                    <td className="p-2">
                        <input
                            type="number"
                            value={player.initialBI || ''}  {/* Thêm || '' để tránh hiển thị 0 khi không có giá trị */}
                            onChange={(e) => updatePlayer(player.id, 'initialBI', e.target.value)}
                            className="w-24 p-1 border rounded text-center mx-auto block"
                            min="0"
                            placeholder="0"  {/* Thêm placeholder thay vì giá trị mặc định */}
                        />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={player.currentChips}
                        onChange={(e) => updatePlayer(player.id, 'currentChips', e.target.value)}
                        className="w-24 p-1 border rounded text-center mx-auto block"
                        min="0"
                      />
                    </td>
                    <td className={`p-2 text-center ${player.currentChips - player.initialBI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(player.currentChips - player.initialBI).toLocaleString()}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateAllInLosses(player.id, -1)}
                          className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{player.allInLosses}</span>
                        <button
                          onClick={() => updateAllInLosses(player.id, 1)}
                          className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </td>
                    <td className={`p-2 text-center font-bold ${player.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {player.score.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokerManager;