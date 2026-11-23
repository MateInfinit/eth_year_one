using UnityEngine;

namespace EthGame.Core
{
    /// <summary>Stores cumulative XP totals required to reach levels 2, 3, and onward.</summary>
    [CreateAssetMenu(fileName = "XpTable", menuName = "EthGame/Core/XP Table")]
    public sealed class XpTable : ScriptableObject
    {
        [SerializeField] private int[] levelThresholds = { 100, 250, 500 };

        /// <summary>Returns a copy so runtime systems cannot mutate the authored table.</summary>
        public int[] GetLevelThresholds()
        {
            return levelThresholds == null ? new int[0] : (int[])levelThresholds.Clone();
        }
    }
}