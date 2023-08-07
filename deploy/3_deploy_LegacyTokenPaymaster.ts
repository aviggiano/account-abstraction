import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers } from 'hardhat'

const deployLegacyTokenPaymaster: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const provider = ethers.provider
  const from = await provider.getSigner().getAddress()
  const network = await provider.getNetwork()
  // only deploy on local test network.
  if (network.chainId !== 31337 && network.chainId !== 1337) {
    return
  }

  const factory = await hre.deployments.get('SimpleAccountFactory')
  const entrypoint = await hre.deployments.get('EntryPoint')
  const ret = await hre.deployments.deploy(
    'LegacyTokenPaymaster', {
      from,
      args: [factory.address, 'PAY', entrypoint.address, from],
      gasLimit: 6e6,
      log: true,
      deterministicDeployment: true
    })
  console.log('==LegacyTokenPaymaster addr=', ret.address)
}

export default deployLegacyTokenPaymaster
