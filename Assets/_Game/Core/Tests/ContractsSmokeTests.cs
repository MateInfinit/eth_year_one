using NUnit.Framework;

namespace EthGame.Core.Tests
{
    public class ContractsSmokeTests
    {
        [Test]
        public void RequestStatChange_ReachesSubscriber()
        {
            Stat receivedStat = Stat.Level;
            int receivedDelta = 0;
            void Handler(Stat s, int d) { receivedStat = s; receivedDelta = d; }

            GameEvents.OnStatChangeRequested += Handler;
            GameEvents.RequestStatChange(Stat.Beers, 1);
            GameEvents.OnStatChangeRequested -= Handler;

            Assert.AreEqual(Stat.Beers, receivedStat);
            Assert.AreEqual(1, receivedDelta);
        }
    }
}
