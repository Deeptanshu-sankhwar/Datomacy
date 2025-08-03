'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Upload, 
  FileText, 
  Coins, 
  Trophy, 
  Clock, 
  BarChart3,
  Database,
  Wallet,
  Calendar,
  LogOut,
  CloudUpload,
  FileCheck,
  PartyPopper,
  Eye,
  Copy,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { api, UserContribution, UserRewards } from '@/lib/api';

export function Dashboard() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [contributions, setContributions] = useState<UserContribution[]>([]);
  const [rewards, setRewards] = useState<UserRewards | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastUpload, setLastUpload] = useState<UserContribution | null>(null);
  const [selectedContribution, setSelectedContribution] = useState<UserContribution | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!address) return;
    
    try {
      setLoading(true);
      const [contributionsData, rewardsData] = await Promise.all([
        api.getUserContributions(address),
        api.getUserRewards(address)
      ]);
      
      setContributions(contributionsData);
      setRewards(rewardsData);
    } catch {
      // Handle error silently for now
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    // Fetch user data when wallet is connected
    if (isConnected && address) {
      fetchUserData();
    }
  }, [isConnected, address, fetchUserData]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Handle data upload
    if (!file || !address) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          let dataContent;
          
          if (file.type === 'application/json' || file.name.endsWith('.json')) {
            dataContent = JSON.parse(content);
          } else {
            dataContent = { rawData: content };
          }

          // Simulate upload progress
          const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
              if (prev >= 90) {
                clearInterval(progressInterval);
                return 90;
              }
              return prev + 10;
            });
          }, 200);

          const uploadedData = await api.uploadData(
            address,
            file.type || 'application/json',
            file.name,
            file.size,
            dataContent
          );

          clearInterval(progressInterval);
          setUploadProgress(100);
          
          setTimeout(() => {
            setUploadProgress(0);
            setUploading(false);
            setLastUpload(uploadedData);
            setShowSuccessModal(true);
            fetchUserData();
          }, 1000);

        } catch {
          setUploading(false);
          setUploadProgress(0);
        }
      };

      reader.readAsText(file);
    } catch {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getDataInsights = (contribution: UserContribution) => {
    const data = contribution.dataContent;
    const insights = [];
    
    if (data && typeof data === 'object') {
      if ('events' in data && Array.isArray(data.events)) {
        insights.push(`${data.events.length} behavioral events`);
      }
      if ('metadata' in data && data.metadata) {
        insights.push('Rich metadata included');
      }
      if ('summary' in data && data.summary) {
        insights.push('Analytics summary');
      }
    }
    
    return insights.length > 0 ? insights : ['Structured data contribution'];
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-8 text-center max-w-md">
          <CardHeader>
            <Wallet className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <CardTitle className="text-2xl text-white">Connect Your Wallet</CardTitle>
            <CardDescription className="text-gray-400">
              Connect your wallet to access your TubeDAO dashboard
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header with Logout */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black mb-2">
              <span className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                TubeDAO
              </span>
              <span className="text-white ml-2">Dashboard</span>
            </h1>
            <p className="text-gray-400">Welcome back, contributor!</p>
          </div>
          
          <Button
            onClick={() => disconnect()}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400 px-6 py-3"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect Wallet
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/5 backdrop-blur-xl border border-red-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-red-400 text-lg">
                <Coins className="w-5 h-5 mr-2" />
                Total Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {rewards?.totalRewards || 0} TDAO
              </div>
              <p className="text-gray-400 text-sm">Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-xl border border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-blue-400 text-lg">
                <Database className="w-5 h-5 mr-2" />
                Contributions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {rewards?.totalDatasets || 0}
              </div>
              <p className="text-gray-400 text-sm">Datasets uploaded</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/5 backdrop-blur-xl border border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-purple-400 text-lg">
                <Trophy className="w-5 h-5 mr-2" />
                Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {contributions.length > 5 ? 'Gold' : contributions.length > 2 ? 'Silver' : 'Bronze'}
              </div>
              <p className="text-gray-400 text-sm">Contributor level</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="bg-gray-900/50 border border-gray-700/50">
            <TabsTrigger value="upload" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
              <Upload className="w-4 h-4 mr-2" />
              Upload Data
            </TabsTrigger>
            <TabsTrigger value="contributions" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <FileText className="w-4 h-4 mr-2" />
              My Contributions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-2xl">
                  <Upload className="w-6 h-6 mr-3 text-red-400" />
                  Upload YouTube Data
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Share your YouTube behavioral data and earn TDAO tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20">
                  <h3 className="text-blue-400 font-bold mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Supported Data Types
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="border-green-500/30 text-green-400">JSON</Badge>
                      <span className="text-gray-300 text-sm">Chrome Extension Data</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="border-blue-500/30 text-blue-400">ZIP</Badge>
                      <span className="text-gray-300 text-sm">Google Takeout Export</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Upload Section */}
                <div className="space-y-4">
                  <Label className="text-white text-lg font-medium">
                    Upload Your Data File
                  </Label>
                  
                  {/* Drag & Drop Zone */}
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-red-400 bg-red-500/10' 
                        : uploading 
                        ? 'border-green-400 bg-green-500/10' 
                        : 'border-gray-600 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-800/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      id="data-upload"
                      type="file"
                      accept=".json,.zip"
                      onChange={handleFileInputChange}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    <div className="flex flex-col items-center space-y-4">
                      {uploading ? (
                        <FileCheck className="w-16 h-16 text-green-400" />
                      ) : dragActive ? (
                        <CloudUpload className="w-16 h-16 text-red-400" />
                      ) : (
                        <Upload className="w-16 h-16 text-gray-400" />
                      )}
                      
                      <div>
                        <h3 className={`text-xl font-bold mb-2 ${
                          uploading ? 'text-green-400' : dragActive ? 'text-red-400' : 'text-white'
                        }`}>
                          {uploading ? 'Processing...' : dragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                        </h3>
                        
                        {!uploading && (
                          <p className="text-gray-400 mb-4">
                            Or click to browse files
                          </p>
                        )}
                        
                        <div className="flex justify-center space-x-4 text-sm text-gray-500">
                          <span>• Supports JSON & ZIP files</span>
                          <span>• Max size: 100MB</span>
                        </div>
                      </div>
                      
                      {!uploading && !dragActive && (
                        <Button 
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 mt-4"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {uploading && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Processing & uploading...</span>
                      <span className="text-gray-300">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contributions">
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-2xl">
                  <FileText className="w-6 h-6 mr-3 text-blue-400" />
                  Your Contributions
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Track all your data contributions and rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contributions.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-bold text-gray-400 mb-2">No contributions yet</h3>
                    <p className="text-gray-500">Upload your first dataset to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contributions.map((contribution) => (
                      <div
                        key={contribution.id}
                        className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 rounded-xl p-6 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedContribution(contribution)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="text-white font-bold text-lg mb-2">{contribution.fileName}</h4>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                                {contribution.dataType.includes('json') ? 'JSON Data' : contribution.dataType}
                              </Badge>
                              <span className="text-gray-400 text-sm flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(contribution.timestamp)}
                              </span>
                              <span className="text-gray-400 text-sm">
                                {formatFileSize(contribution.fileSize)}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {getDataInsights(contribution).map((insight, index) => (
                                <span key={index} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md">
                                  {insight}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right ml-6">
                            <div className="text-2xl font-bold text-green-400">
                              +{contribution.rewardAmount} TDAO
                            </div>
                            <Badge 
                              variant="outline" 
                              className="border-green-500/30 text-green-400 mt-1"
                            >
                              {contribution.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <Separator className="bg-gray-600/30 my-4" />
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2 text-gray-400 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>Processed instantly</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-gray-600/50 text-gray-300 hover:bg-gray-700/50"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedContribution(contribution);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-2xl">
                  <BarChart3 className="w-6 h-6 mr-3 text-purple-400" />
                  Contribution Analytics
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Insights into your data contributions and impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-purple-500/10 rounded-xl p-6 border border-purple-500/20">
                    <h3 className="text-purple-400 font-bold mb-4">Contribution Timeline</h3>
                    <div className="space-y-3">
                      {contributions.slice(0, 5).map((contribution) => (
                        <div key={contribution.id} className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">{formatDate(contribution.timestamp)}</span>
                          <Badge variant="outline" className="border-purple-500/30 text-purple-400 text-xs">
                            +{contribution.rewardAmount} TDAO
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
                    <h3 className="text-green-400 font-bold mb-4">Impact Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-300">Data Quality Score</span>
                          <span className="text-green-400">95%</span>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-300">Contribution Consistency</span>
                          <span className="text-green-400">87%</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-green-500/30">
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <PartyPopper className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <DialogTitle className="text-center text-2xl text-white">
                Contribution Successful! 🎉
              </DialogTitle>
              <DialogDescription className="text-center text-gray-300">
                Your data has been processed and you&apos;ve earned TDAO tokens
              </DialogDescription>
            </DialogHeader>
            
            {lastUpload && (
              <div className="space-y-4">
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-white">{lastUpload.fileName}</h4>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      +{lastUpload.rewardAmount} TDAO
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div>Size: {formatFileSize(lastUpload.fileSize)}</div>
                    <div>Status: {lastUpload.status}</div>
                    <div>Processed: {formatDate(lastUpload.timestamp)}</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setShowSuccessModal(false)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Continue
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedContribution(lastUpload);
                      setShowSuccessModal(false);
                    }}
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Contribution Details Modal */}
        <Dialog open={!!selectedContribution} onOpenChange={() => setSelectedContribution(null)}>
          <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-gray-700/50 max-h-[80vh] overflow-y-auto">
            {selectedContribution && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                    {selectedContribution.fileName}
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Detailed information about your data contribution
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Contribution Overview */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                      <div className="text-sm text-blue-400 mb-1">File Size</div>
                      <div className="text-white font-bold">{formatFileSize(selectedContribution.fileSize)}</div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                      <div className="text-sm text-green-400 mb-1">Reward Earned</div>
                      <div className="text-white font-bold">{selectedContribution.rewardAmount} TDAO</div>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                      <div className="text-sm text-purple-400 mb-1">Upload Date</div>
                      <div className="text-white font-bold">{formatDate(selectedContribution.timestamp)}</div>
                    </div>
                    <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                      <div className="text-sm text-orange-400 mb-1">Status</div>
                      <div className="text-white font-bold">{selectedContribution.status}</div>
                    </div>
                  </div>
                  
                  {/* Data Insights */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                    <h4 className="text-white font-bold mb-3 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Data Insights
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getDataInsights(selectedContribution).map((insight, index) => (
                        <Badge key={index} variant="outline" className="border-purple-500/30 text-purple-300">
                          {insight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Transaction Details */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                    <h4 className="text-white font-bold mb-3 flex items-center">
                      <Database className="w-4 h-4 mr-2" />
                      Transaction Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contribution ID:</span>
                        <div className="flex items-center">
                          <span className="text-white font-mono">{selectedContribution.id.slice(0, 8)}...</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(selectedContribution.id)}
                            className="ml-2 h-6 w-6 p-0"
                          >
                            {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Data Type:</span>
                        <span className="text-white">{selectedContribution.dataType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing Time:</span>
                        <span className="text-white">Instant</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => setSelectedContribution(null)}
                      className="flex-1"
                      variant="outline"
                    >
                      Close
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Explorer
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 